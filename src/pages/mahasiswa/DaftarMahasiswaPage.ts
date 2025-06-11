import { BasePage } from '@src/pages/BasePage';
import { Locator, expect } from '@playwright/test';

/**
 * Page-object untuk halaman **Daftar Mahasiswa** (admin).
 *
 * URL: `/allmahasiswa`.
 */
export class DaftarMahasiswaPage extends BasePage {
  /* ──────────────────────────
   * SECTION: Global locators
   * ────────────────────────── */

  /** Input pencarian nama / NPM */
  private searchInput: Locator = this.page.getByPlaceholder('Search...');

  /** Tombol "Cari Mahasiswa" */
  private cariBtn: Locator = this.page.locator(
    '.button-container-group2',
    { hasText: /cari mahasiswa/i }
  );

  /** Dropdown filter */
  private prodiSelect: Locator = this.page.locator(
    'select[name="program_studi"]'
  );
  private jenjangSelect: Locator = this.page.locator(
    'select[name="jenjang"]'
  );
  private pengalamanSelect: Locator = this.page.locator(
    'select[name="pengalaman"]'
  );

  /** Tabel & baris mahasiswa */
  private rows: Locator = this.page.locator('tbody > tr');

  /** Baris berdasarkan nama mahasiswa */
  rowByName = (name: string): Locator =>
    this.rows.filter({ has: this.page.locator('td', { hasText: name }) });


  /** Modal ubah detail */
  private jenjangModalRoot: Locator = this.page.locator(
    'div.tw-bg-white.tw-rounded-md',
    { hasText: /konfirmasi perubahan jenjang/i }
  );

  private pengalamanModalRoot: Locator = this.page.locator(
    'div.tw-bg-white.tw-rounded-md',
    { hasText: /konfirmasi perubahan pengalaman/i }
  );

  private jenjangModalOld: Locator = this.jenjangModalRoot
    .locator('div.tw-font-semibold')
    .first();

  private jenjangModalNew: Locator = this.jenjangModalRoot
    .locator('div.tw-font-semibold')
    .nth(1);

  private jenjangModalCancelBtn: Locator = this.jenjangModalRoot.getByRole('button', { name: /batal/i });
  private jenjangModalConfirmBtn: Locator = this.jenjangModalRoot.getByRole('button', { name: /yakin/i });

  private pengalamanModalCancelBtn: Locator = this.pengalamanModalRoot.getByRole('button', { name: /batal/i });
  private pengalamanModalConfirmBtn: Locator = this.pengalamanModalRoot.getByRole('button', { name: /yakin/i });

  private successToasts: Locator = this.page.locator('div.Toastify__toast--success').last();

  /* ──────────────────────────
   * SECTION: Navigation
   * ────────────────────────── */

  async open() {
    await this.goto('/allmahasiswa');
  }

  /* ──────────────────────────
   * SECTION: Filters & search
   * ────────────────────────── */

  async typeSearch(keyword: string) {
    await this.searchInput.fill(keyword);
  }

  async clickCari() {
    await this.cariBtn.click();
  }

  async selectProgramStudi(label: string) {
    await this.prodiSelect.selectOption({ label });
  }

  async selectJenjang(label: string) {
    await this.jenjangSelect.selectOption({ label });
  }

  async selectPengalaman(label: string) {
    await this.pengalamanSelect.selectOption({ label });
  }

  /* ──────────────────────────
   * SECTION: Row-level helpers
   * ────────────────────────── */

  /** Pilih (checkbox) baris mahasiswa */
  async toggleRowCheckbox(name: string) {
    await this.rowByName(name).locator('input[type="checkbox"]').click();
  }

  /** Klik tombol "Lihat" pada baris mahasiswa */
  async viewMahasiswaDetail(name: string) {
    await this.rowByName(name)
      .locator('.button-container-group2', { hasText: /lihat/i })
      .click();
  }

  /** Ambil info singkat dari baris (npm, email, prodi, jenjang, pengalaman) */
  async getRowInfo(name: string) {
    const row = this.rowByName(name);

    const [npm, email, prodi] = await Promise.all(
      [3, 4, 5].map((i) => row.locator('td').nth(i).innerText())
    );

    const jenjang = await row
      .locator('td')
      .nth(6)
      .locator('.css-1dimb5e-singleValue')
      .innerText();

    const pengalaman = await row
      .locator('td')
      .nth(7)
      .locator('.css-1dimb5e-singleValue')
      .innerText();

    return { name, npm: npm.trim(), email: email.trim(), prodi: prodi.trim(), jenjang: jenjang.trim(), pengalaman: pengalaman.trim() };
  }

  async getColumnValuesByName(columnName: string): Promise<string[]> {
    // Cari indeks kolom yang dimaksud
    const headerCells = this.page.locator('thead tr th');
    const headerCount = await headerCells.count();

    let colIdx = -1;
    for (let i = 0; i < headerCount; i++) {
      const headerText = (await headerCells.nth(i).innerText()).trim();
      if (headerText.localeCompare(columnName.trim(), undefined, { sensitivity: 'accent', usage: 'search' }) === 0) {
        colIdx = i;
        break;
      }
    }
    if (colIdx === -1) {
      throw new Error(`Kolom "${columnName}" tidak ditemukan di tabel.`);
    }

    // Re-gunakan helper berbasis indeks yang sudah ada
    return this.getColumnValues(colIdx);
  }

  async getColumnValues(colIdx: number): Promise<string[]> {
    const totalRows = await this.rows.count();
    const values: string[] = [];

    for (let i = 0; i < totalRows; i++) {
      const cell = this.rows.nth(i).locator('td').nth(colIdx);
      values.push(await this.extractCellText(cell));
    }
    return values;
  }

  private async extractCellText(cell: Locator): Promise<string> {
    const singleValue = cell.locator('.css-1dimb5e-singleValue');
    if (await singleValue.count()) {
      return (await singleValue.innerText()).trim();
    }
    return (await cell.innerText()).trim();
  }

  async expectColumnAllContains(columnName: string, expected: string): Promise<boolean> {
    const values = await this.getColumnValuesByName(columnName);
    const pattern = expected.trim().toLowerCase();
    return values.every((v) => v.toLowerCase().includes(pattern));
  }

  /* ──────────────────────────
  * SECTION: Bulk-edit helpers
  * ────────────────────────── */

  /** Snackbar */
  private snackbarRoot: Locator = this.page.locator(
    'div.tw-fixed.tw-bottom-10', { hasText: /dipilih/i }
  );
  private snackbarEditJenjangBtn   = this.snackbarRoot.getByRole('button', { name: /edit jenjang/i });
  private snackbarEditPengalamanBtn= this.snackbarRoot.getByRole('button', { name: /edit pengalaman/i });
  private snackbarPilihSemuaBtn    = this.snackbarRoot.getByRole('button', { name: /pilih semua/i });

  /** Form modal "Ubah Jenjang" / "Ubah Pengalaman" (dropdown + Submit) */
  private editJenjangForm   = this.page.locator('div', { hasText: /^ubah jenjang$/i }).locator('..');
  private editPengalamanForm= this.page.locator('div', { hasText: /^ubah pengalaman$/i }).locator('..');
  private editModalSubmitBtn = (root: Locator) =>
    root.getByRole('button', { name: /^submit$/i });

  /** Hitung total baris mahasiswa yang sedang tampil */
  async countRows(): Promise<number> {
    return this.rows.count();
  }

  /**
   * Ubah kolom **Jenjang** pada baris mahasiswa → memunculkan modal konfirmasi.
   */
  async changeJenjang(name: string, newJenjang: string) {
    const jenjangCell = this.rowByName(name).locator('td').nth(6);

    await jenjangCell.click();
    const newJenjangOpt = this.page.getByRole('option', { name: newJenjang, exact: true }).last();
    await newJenjangOpt.click();

    // Tunggu modal muncul
    await this.waitJenjangModal();
  }

  /**
   * Ubah kolom **Pengalaman** pada baris mahasiswa → memunculkan modal konfirmasi.
   */
  async changePengalaman(name: string, newExpLevel: string) {
    const expCell = this.rowByName(name).locator('td').nth(7);

    await expCell.click();
    const newExpOption = this.page.getByRole('option', { name: newExpLevel, exact: true }).last();
    await newExpOption.click();

    await this.waitPengalamanModal(); 
  }

  /* ═══════════════════════════════════════════════
   *  MODAL KONFIRMASI PERUBAHAN JENJANG
   * ═══════════════════════════════════════════════ */
  /** Tunggu modal muncul */
  async waitJenjangModal() {
    await expect(this.jenjangModalRoot).toBeVisible();
  }

  async waitPengalamanModal() {
    await expect(this.pengalamanModalRoot).toBeVisible();
  }

  /** Dapatkan jenjang _before_ → _after_ */
  async getJenjangDiff() {
    const before = (await this.jenjangModalOld.innerText()).trim();
    const after  = (await this.jenjangModalNew.innerText()).trim();
    return { before, after };
  }

  /** Klik tombol **Yakin** */
  async confirmJenjangChange() {
    await this.jenjangModalConfirmBtn.click();
  }

  /** Klik tombol **Yakin** pada modal pengalaman */
  async confirmPengalamanChange() {
    await this.pengalamanModalConfirmBtn.click();
  }

  /** Klik tombol **Batal** */
  async cancelJenjangChange() {
    await this.jenjangModalCancelBtn.click();
  }

  /** Klik tombol **Batal** pada modal pengalaman */
  async cancelPengalamanChange() {
    await this.pengalamanModalCancelBtn.click();  
  }

  async selectRows(names: string[]) {
    for (const n of names) {
      await this.toggleRowCheckbox(n);
    }
    await expect(this.snackbarRoot).toBeVisible();
  }

  /** snackbar */

  /** Klik tombol "Edit Jenjang" / "Edit Pengalaman" di snackbar */
  async openBulkEditJenjang()      { await this.snackbarEditJenjangBtn.click(); }
  async openBulkEditPengalaman()   { await this.snackbarEditPengalamanBtn.click(); }

  /** Isi dropdown di modal bulk-edit kemudian tekan Submit */
  private async fillBulkSelect(root: Locator, valueLabel: string) {
    await expect(root).toBeVisible();
    // buka React-Select
    await root.locator('input[id^="react-select"]').fill(valueLabel);
    await this.page.keyboard.press('Enter');
    await this.editModalSubmitBtn(root).click();
  }

  /** Workflow lengkap bulk ganti Jenjang → muncul modal konfirmasi */
  async bulkChangeJenjang(valueLabel: string) {
    await this.openBulkEditJenjang();
    await this.page.waitForTimeout(500); 
    await this.fillBulkSelect(this.editJenjangForm, valueLabel);
    await this.page.waitForTimeout(500); 
    await this.waitJenjangModal();
    await this.page.waitForTimeout(500); 
  }

  /** Workflow lengkap bulk ganti Pengalaman → muncul modal konfirmasi */
  async bulkChangePengalaman(valueLabel: string) {
    await this.openBulkEditPengalaman();
    await this.fillBulkSelect(this.editPengalamanForm, valueLabel);
    await this.waitPengalamanModal();
  }

  /** Toast */
  async waitForSuccessToast(textContains?: string) {
    const toast = textContains
      ? this.successToasts.filter({ hasText: textContains })
      : this.successToasts.first();

    await expect(toast).toBeVisible({ timeout: 10000 });
  }
}
