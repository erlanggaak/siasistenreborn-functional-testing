import { BasePage } from '@pages/BasePage';
import { Locator, expect } from '@playwright/test';

/**
 * Page-object untuk halaman **Daftar Log Mahasiswa** milik 1 mata kuliah.
 *
 * URL: `/matkul/:id/log`
 */
export class DaftarLogMahasiswaPage extends BasePage {

  private backLink: Locator = this.page
    .locator('a')
    .filter({ hasText: /kembali ke daftar matakuliah/i });

  /** Bar wrapper berisi 3 dropdown filter */
  private filterBar: Locator = this.page.locator('div.tw-flex.tw-space-x-4');

  /** <select> Status */
  private statusSelect = this.filterBar.locator('select').nth(0);

  /** <select> Partial / Full */
  private approvalTypeSelect = this.filterBar.locator('select').nth(1);

  /** <select> Sort */
  private sortSelect = this.filterBar.locator('select').nth(2);

  /** Input "Cari mahasiswa..." */
  private searchMhsInput: Locator = this.page.getByPlaceholder('Cari mahasiswa...');

  /** Tombol "Cari" */
  private searchMhsBtn: Locator = this.page.getByRole('button', { name: /^cari$/i });

  private studentCards: Locator = this.page.locator(
    '.logs-container > .tw-mb-8.tw-bg-white'
  );

  private cardByName = (fullName: string): Locator =>
    this.studentCards.filter({
      has: this.page.locator('h3', { hasText: new RegExp(fullName, 'i') }),
    });

  /** Card berdasarkan NPM */
  private cardByNpm = (npm: string): Locator =>
    this.studentCards.filter({
      has: this.page.locator('p', { hasText: new RegExp(`npm:\\s*${npm}`, 'i') }),
    });

  private partialApproveHeader: Locator = this.page.getByRole('heading', { name: 'Partial Approval' });
  private durationInput: Locator = this.page.getByPlaceholder('Masukkan durasi dalam menit');
  private messageInput: Locator = this.page.getByRole('textbox', { name: 'Tambahkan pesan (alasan partial approval)' });
  private submitPartialApproveBtn: Locator = this.page.getByRole('button', { name: 'Setujui Sebagian' });


  /*  Kamus: alias → nilai value pada <option>  */
  private readonly STATUS_MAP: Record<string, string> = {
    "": '',
    "Dilaporkan": '1',     // Dilaporkan
    "Telah Disetujui": '2',     // Telah Disetujui
    "Ditolak": '3',     // Ditolak
    "Diproses": '4',   // Diproses
  };

  private readonly APPROVAL_MAP: Record<string, string> = {
    "": '',
    "Partial Approval": 'true',   // Partial Approval
    "Full Approval": 'false',     // Full Approval
  };

  private readonly SORT_MAP: Record<string, string> = {
    "Nama (A-Z)": 'name',
    "Nama (Z-A)": '-name',
    "Total Durasi (Rendah-Tinggi)": 'total_duration',
    "Total Durasi (Tinggi-Rendah)": '-total_duration',
    "Durasi Diajukan (Rendah-Tinggi)": 'total_duration_submitted',
    "Durasi Diajukan (Tinggi-Rendah)": '-total_duration_submitted',
    "Durasi Disetujui (Rendah-Tinggi)": 'total_approved_duration',
    "Durasi Disetujui (Tinggi-Rendah)": '-total_approved_duration',
  };


  async open(courseId: number | string) {
    await this.goto(`/matkul/${courseId}/log`);
    await expect(this.backLink).toBeVisible();
  }

  async countStudents(): Promise<number> {
    return this.studentCards.count();
  }

  /** Ketik kata kunci dan klik tombol "Cari" */
  async searchMahasiswa(keyword: string) {
    await this.searchMhsInput.fill(keyword);
    await this.searchMhsBtn.click();
  }

  /** Cari dan tunggu card mahasiswa *by name* tampil */
  async searchByName(name: string) {
    await this.searchMahasiswa(name);
    await expect(this.cardByName(name)).toBeVisible();
  }

  /** Cari dan tunggu card mahasiswa *by NPM* tampil */
  async searchByNpm(npm: string) {
    await this.searchMahasiswa(npm);
    await expect(this.cardByNpm(npm)).toBeVisible();
  }

  async filterStatus(key: keyof typeof this.STATUS_MAP) {
    await this.statusSelect.selectOption(this.STATUS_MAP[key]);
  }

  async filterApprovalType(key: keyof typeof this.APPROVAL_MAP) {
    await this.approvalTypeSelect.selectOption(this.APPROVAL_MAP[key]);
  }

  async sortBy(key: keyof typeof this.SORT_MAP) {
    await this.sortSelect.selectOption(this.SORT_MAP[key]);
  }

  async getStudentSummary(name: string) {
    const card = this.cardByName(name);

    const npm = (await card.locator('p', { hasText: /^npm:/i }).innerText())
      .split(':')[1]
      .trim();

    const [total, submitted, approved] = await Promise.all(
      ['Total Durasi', 'Durasi Diajukan', 'Durasi Disetujui'].map(async (label) =>
        card
          .locator('div', { hasText: label })
          .locator('..') 
          .locator('.tw-font-semibold')
          .innerText()
      )
    );

    return {
      name,
      npm,
      totalDuration: total,
      submittedDuration: submitted,
      approvedDuration: approved,
    };
  }

  async selectAllLogs(name: string) {
    const card = this.cardByName(name);
    await card
      .locator('button', { hasText: /pilih semua/i })
      .click({ force: true });
  }

  private rows(name: string): Locator {
    return this.cardByName(name).locator('tbody > tr');
  }

  private rowByDesc(name: string, desc: string): Locator {
    return this.rows(name).filter({
      has: this.page.locator('td[title]', { hasText: desc }),
    });
  }

  private async clickRowAction(
    name: string,
    desc: string,
    alt: 'partial-approve' | 'approve' | 'reject' | 'message'
  ) {
    const row = this.rowByDesc(name, desc);
    await row.locator(`img[alt="${alt}"]`).click({ force: true });
  }

  // Convenience wrappers
  async partialApprove(name: string, desc: string) {
    await this.clickRowAction(name, desc, 'partial-approve');
  }
  async approve(name: string, desc: string) {
    await this.clickRowAction(name, desc, 'approve');
  }
  async reject(name: string, desc: string) {
    await this.clickRowAction(name, desc, 'reject');
  }
  async openMessageThread(name: string, desc: string) {
    const row = this.rowByDesc(name, desc);
    await row.locator('a[href*="/pesan"]').click();
  }

  async fillPartialApproveForm(duration: number, message: string) {
    await expect(this.partialApproveHeader).toBeVisible();
    await this.durationInput.fill(String(duration));
    await this.messageInput.fill(message);
    // await this.submitPartialApproveBtn.click();
    // await expect(this.partialApproveHeader).not.toBeVisible();
  }
}
