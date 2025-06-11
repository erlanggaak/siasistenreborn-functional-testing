import { Page, expect } from '@playwright/test';

/**
 * Kelas dasar semua PageObject.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(relativePath: string) {
    await this.page.goto(process.env.BASE_URL! + relativePath);
  }
}
