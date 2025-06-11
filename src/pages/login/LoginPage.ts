import { BasePage } from '../BasePage';
import { Locator } from '@playwright/test';

export class LoginPage extends BasePage {
  /* === Locators === */
  private userInput: Locator = this.page.getByLabel('Username');
  private passInput: Locator = this.page.getByLabel('Password');
  private submitBtn: Locator = this.page.locator('a').filter({ hasText: 'Masuk' });

  /* === Actions === */
  async open() {
    await this.goto('/login');
  }

  async login(username: string, password: string) {
    await this.userInput.fill(username);
    await this.passInput.fill(password);
    await this.submitBtn.click();
  }
}
