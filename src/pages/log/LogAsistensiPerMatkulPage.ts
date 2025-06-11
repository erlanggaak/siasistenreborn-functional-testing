import { BasePage } from '@pages/BasePage';
import { Locator, Page, expect } from '@playwright/test';

/**
 * Page-object untuk halaman **Log Asistensi Per Mata Kuliah**.
 *
 * – Tautan menu: “Log” di sidebar  
 * – Contoh URL : `/listlowongan`
 */
export class LogAsistensiPerMatkulPage extends BasePage {
  private heading: Locator = this.page.getByText('Log Asistensi Per Mata Kuliah');
  private termSelect: Locator = this.page.locator(
    'select.filter-container'
  );
  private courseCards: Locator = this.page.locator('.matkul-container');
  private cardByKode(kode: string): Locator {
    return this.courseCards.filter({
      has: this.page.locator('.matkul-id', { hasText: kode }),
    });
  }

  async open() {
    await this.goto('/listLowongan');
    await expect(this.heading).toBeVisible();
  }
  async selectTerm(termLabel: string) {
    await this.termSelect.selectOption({ label: termLabel });
  }
  async countCourses(): Promise<number> {
    return this.courseCards.count();
  }
  async goToCourseLogs(kodeMatkul: string) {
    const card = this.cardByKode(kodeMatkul);
    await card.locator('a:has-text("Logs")').click();
  }
  async getCourseInfo(kodeMatkul: string) {
    const card = this.cardByKode(kodeMatkul);

    const name = await card.locator('.header-h7').innerText();
    const dosen = await card
      .locator('.matkul-detail', { has: this.page.locator('img[alt="userIcon"]') })
      .innerText();
    const term = await card
      .locator('.matkul-detail', { has: this.page.locator('img[alt="userIcon"]') })
      .nth(1) 
      .innerText();

    return { name: name.trim(), dosen: dosen.trim(), term: term.trim() };
  }
}
