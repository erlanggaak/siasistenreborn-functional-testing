import { test, expect } from '@fixtures/PageFixtures';
import { BasePage } from '@pages/BasePage';
import { Locator } from '@playwright/test';

/**
 * Page-object untuk halaman **Daftar Lowongan**.
 * - URL utama: `/lowongan`
 */
export class DaftarLowonganPage extends BasePage {
  private searchInput: Locator = this.page.getByPlaceholder('Search...');
  private termSelect: Locator = this.page.getByLabel('Term');
  private jenjangSelect: Locator = this.page.getByLabel('Jenjang');
  private lihatBtn: Locator = this.page.getByText('Lihat');
  private buatLowonganBtn: Locator = this.page.getByText('Buat Lowongan');

  async open() {
    await this.goto('/lowongan');
    await expect(this.page.getByRole('heading', { name: /daftar lowongan/i }))
      .toBeVisible();
  }

  async search(keyword: string) {
    await this.searchInput.fill(keyword);
  }

  async selectTerm(termText: string) {
    await this.termSelect.selectOption({ label: termText });
  }

  async selectJenjang(jenjang: 'S1' | 'S2' | 'S3') {
    await this.jenjangSelect.selectOption(jenjang);
  }

  async applyFilter() {
    await this.lihatBtn.click();
  }

  async clickBuatLowongan() {
    await this.buatLowonganBtn.click();
  }

//   /** klik tombol “Buka” pada baris tertentu */
//   async bukaLowongan(namaLowongan: string) {
//     const row = this.rowByNamaLowongan(namaLowongan);
//     await row.locator('div.button-container:has-text("Buka")').click();
//   }

//   /** klik ikon *Edit* (pensil) */
//   async editLowongan(namaLowongan: string) {
//     const row = this.rowByNamaLowongan(namaLowongan);
//     await row.locator('a[href*="/lowongan/"]:has(img[alt="edit"])').click();
//   }

//   /** klik ikon *Delete* (tong sampah) */
//   async deleteLowongan(namaLowongan: string) {
//     const row = this.rowByNamaLowongan(namaLowongan);
//     await row.locator('img[alt="delete"]').click();
//   }

//   /** klik ikon *Pelamar* */
//   async viewPelamar(namaLowongan: string) {
//     const row = this.rowByNamaLowongan(namaLowongan);
//     await row.locator('img[alt="pelamar"]').click();
//   }

//   /** ambil teks selisih kebutuhan TA pada baris */
//   async getSelisih(namaLowongan: string): Promise<number> {
//     const row = this.rowByNamaLowongan(namaLowongan);
//     const text = await row.locator('td').nth(7).innerText(); // kolom “Selisih”
//     return Number(text.trim());
//   }
}
