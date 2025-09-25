#!/usr/bin/env tsx

import { program } from 'commander';
import chalk from 'chalk';
import * as cheerio from 'cheerio';
import PQueue from 'p-queue';
import { URL } from 'url';

interface LinkCheckOptions {
  maxPages: number;
  concurrency: number;
  timeout: number;
  ignore: string[];
  includeExternal: boolean;
}

interface CheckResult {
  url: string;
  status: number;
  error?: string;
  isExternal: boolean;
}

class LinkChecker {
  private baseUrl: string;
  private options: LinkCheckOptions;
  private visited = new Set<string>();
  private results: CheckResult[] = [];
  private queue: PQueue;

  constructor(baseUrl: string, options: LinkCheckOptions) {
    this.baseUrl = baseUrl;
    this.options = options;
    this.queue = new PQueue({ concurrency: options.concurrency });
  }

  private isIgnored(url: string): boolean {
    return this.options.ignore.some(pattern => {
      if (pattern.startsWith('/')) {
        return url.includes(pattern);
      }
      return url.includes(pattern);
    });
  }

  private isExternal(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const baseObj = new URL(this.baseUrl);
      return urlObj.origin !== baseObj.origin;
    } catch {
      return false;
    }
  }

  private async checkUrl(url: string): Promise<CheckResult> {
    const isExternal = this.isExternal(url);
    
    if (isExternal && !this.options.includeExternal) {
      return { url, status: 0, isExternal: true };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        method: 'HEAD',
        headers: {
          'User-Agent': 'LinkChecker/1.0'
        }
      });

      clearTimeout(timeoutId);

      return {
        url,
        status: response.status,
        isExternal
      };
    } catch (error) {
      return {
        url,
        status: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        isExternal
      };
    }
  }

  private async extractLinks(html: string, baseUrl: string): Promise<string[]> {
    const $ = cheerio.load(html);
    const links: string[] = [];

    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');
      if (!href) return;

      try {
        const url = new URL(href, baseUrl).href;
        if (!this.isIgnored(url) && !this.visited.has(url)) {
          links.push(url);
        }
      } catch {
        // Invalid URL, skip
      }
    });

    return links;
  }

  private async crawlPage(url: string): Promise<void> {
    if (this.visited.has(url) || this.visited.size >= this.options.maxPages) {
      return;
    }

    this.visited.add(url);

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'LinkChecker/1.0'
        }
      });

      if (!response.ok) {
        this.results.push({
          url,
          status: response.status,
          isExternal: this.isExternal(url)
        });
        return;
      }

      const html = await response.text();
      const links = await this.extractLinks(html, url);

      // Add internal links to crawl queue
      for (const link of links) {
        if (!this.isExternal(link)) {
          this.queue.add(() => this.crawlPage(link));
        }
      }

      // Check all links on this page
      for (const link of links) {
        this.queue.add(async () => {
          const result = await this.checkUrl(link);
          this.results.push(result);
        });
      }

    } catch (error) {
      this.results.push({
        url,
        status: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        isExternal: this.isExternal(url)
      });
    }
  }

  async check(): Promise<void> {
    console.log(chalk.blue(`🔍 Starting link check for ${this.baseUrl}`));
    console.log(chalk.gray(`Max pages: ${this.options.maxPages}, Concurrency: ${this.options.concurrency}`));
    
    await this.crawlPage(this.baseUrl);
    await this.queue.onIdle();

    this.printResults();
  }

  private printResults(): void {
    const failed = this.results.filter(r => r.status >= 400 || r.error);
    const external = this.results.filter(r => r.isExternal);
    const internal = this.results.filter(r => !r.isExternal);

    console.log(chalk.green(`\n✅ Link check complete!`));
    console.log(chalk.gray(`Total links checked: ${this.results.length}`));
    console.log(chalk.gray(`Internal links: ${internal.length}`));
    console.log(chalk.gray(`External links: ${external.length}`));
    console.log(chalk.gray(`Pages crawled: ${this.visited.size}`));

    if (failed.length > 0) {
      console.log(chalk.red(`\n❌ ${failed.length} broken links found:`));
      failed.forEach(result => {
        const status = result.status || 'ERROR';
        const error = result.error ? ` (${result.error})` : '';
        console.log(chalk.red(`  ${status} ${result.url}${error}`));
      });
      process.exit(1);
    } else {
      console.log(chalk.green(`\n🎉 All links are working!`));
    }
  }
}

program
  .name('link-check')
  .description('Check internal and external links on a website')
  .argument('<url>', 'Base URL to check')
  .option('-m, --max-pages <number>', 'Maximum pages to crawl', '1000')
  .option('-c, --concurrency <number>', 'Concurrent requests', '5')
  .option('-t, --timeout <number>', 'Request timeout in ms', '10000')
  .option('-i, --ignore <patterns>', 'Comma-separated ignore patterns', '')
  .option('--include-external', 'Include external links in check', false)
  .action(async (url, options) => {
    const ignorePatterns = options.ignore ? options.ignore.split(',').map((p: string) => p.trim()) : [];
    
    const checker = new LinkChecker(url, {
      maxPages: parseInt(options.maxPages),
      concurrency: parseInt(options.concurrency),
      timeout: parseInt(options.timeout),
      ignore: ignorePatterns,
      includeExternal: options.includeExternal
    });

    await checker.check();
  });

program.parse();
