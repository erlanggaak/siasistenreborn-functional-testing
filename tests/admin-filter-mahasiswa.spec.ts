// tests/admin-change-detail-mahasiswa.spec.ts
import { test, expect } from '@fixtures/PageFixtures';
import { validAdmin } from '../src/fixtures/credentials';

test.describe('Admin Filter Mahasiswa di Halaman Daftar List Mahasiswa', () => {
  /* ═════════ PRE-CONDITION ═════════ */
  test.beforeEach(async ({ loginPage, page, daftarMahasiswaPage }) => {
    // 1) Login
    await loginPage.open();
    await loginPage.login(validAdmin.username, validAdmin.password);
    await expect(page).toHaveURL(/admin\/dashboard/);

    // 2) Buka halaman Daftar Mahasiswa
    await daftarMahasiswaPage.open();
    await expect(page.getByText('Daftar Mahasiswa')).toBeVisible();
    await page.waitForTimeout(5000);
  });

  test('Admin filter mahasiswa berdasarkan nama, NPM, dan email', async ({ page, daftarMahasiswaPage }) => {
    await test.step('Admin mencari mahasiswa berdasarkan nama', async () => {
      await daftarMahasiswaPage.typeSearch('Adiarja Halim');
      await daftarMahasiswaPage.clickCari();
      await page.waitForTimeout(5000);
      await expect(
        daftarMahasiswaPage.rowByName('Adiarja Halim')
      ).toBeVisible();
    });

    await test.step('Admin mencari mahasiswa berdasarkan NPM', async () => {
      await daftarMahasiswaPage.typeSearch('2401920398');
      await daftarMahasiswaPage.clickCari();
      await page.waitForTimeout(5000);
      await expect(
        daftarMahasiswaPage.rowByName('Adiarja Halim')
      ).toBeVisible();
    });

    await test.step('Admin mencari mahasiswa berdasarkan email', async () => {
      await daftarMahasiswaPage.typeSearch('mahasiswa2@gmail.com');
      await daftarMahasiswaPage.clickCari();
      await page.waitForTimeout(5000);
      await expect(
        daftarMahasiswaPage.rowByName('Adiarja Halim')
      ).toBeVisible();
    });
  });

  test('Admin filter mahasiswa berdasarkan program studi', async ({ page, daftarMahasiswaPage }) => {
    await test.step('Admin menyaring mahasiswa berdasarkan nama', async () => {
      await daftarMahasiswaPage.selectProgramStudi('S1 Reguler - Ilmu Komputer');
      await page.waitForTimeout(5000);
      await daftarMahasiswaPage.expectColumnAllContains('Program Studi', 'S1 Reguler - Ilmu Komputer');
    });
  });

  test('Admin filter mahasiswa berdasarkan jenjang', async ({ page, daftarMahasiswaPage }) => {
    await test.step('Admin menyaring mahasiswa berdasarkan jenjang pendidikan', async () => {
      await daftarMahasiswaPage.selectJenjang('Mahasiswa S1');
      await page.waitForTimeout(5000);
      await daftarMahasiswaPage.expectColumnAllContains('Jenjang Mahasiswa', 'Mahasiswa S1');
    });
  });

  test('Admin filter mahasiswa berdasarkan pengalaman', async ({ page, daftarMahasiswaPage }) => {
    await test.step('Admin menyaring mahasiswa berdasarkan pengalaman', async () => {
      await daftarMahasiswaPage.selectPengalaman('Junior');
      await page.waitForTimeout(5000);
      await daftarMahasiswaPage.expectColumnAllContains('Pengalaman', 'Junior');
    });
  });
});
