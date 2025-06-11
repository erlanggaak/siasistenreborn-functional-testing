import { test, expect } from '@fixtures/PageFixtures';
import testData from 'test-data/admin-filter-mahasiswa-data.json';

const { admin, searches, filters, expectedStudent } = testData;

test.describe('Admin – Filter Mahasiswa di Daftar Mahasiswa', () => {
  /* ═════════ PRE-CONDITION ═════════ */
  test.beforeEach(async ({ loginPage, page, daftarMahasiswaPage }) => {
    // 1) Login sebagai admin
    await loginPage.open();
    await loginPage.login(admin.username, admin.password);
    await expect(page).toHaveURL(/admin\/dashboard/);

    // 2) Buka halaman Daftar Mahasiswa
    await daftarMahasiswaPage.open();
    await expect(page.getByText('Daftar Mahasiswa')).toBeVisible();
    await page.waitForTimeout(5_000);
  });

  test('Admin filter mahasiswa berdasarkan nama, NPM, dan email', async ({ page, daftarMahasiswaPage }) => {
    await test.step('Admin mencari mahasiswa berdasarkan nama', async () => {
      await daftarMahasiswaPage.typeSearch(searches.byName);
      await daftarMahasiswaPage.clickCari();
      await page.waitForTimeout(5_000);
      await expect(daftarMahasiswaPage.rowByName(expectedStudent)).toBeVisible();
    });

    await test.step('Admin mencari mahasiswa berdasarkan NPM', async () => {
      await daftarMahasiswaPage.typeSearch(searches.byNpm);
      await daftarMahasiswaPage.clickCari();
      await page.waitForTimeout(5_000);
      await expect(daftarMahasiswaPage.rowByName(expectedStudent)).toBeVisible();
    });

    await test.step('Admin mencari mahasiswa berdasarkan email', async () => {
      await daftarMahasiswaPage.typeSearch(searches.byEmail);
      await daftarMahasiswaPage.clickCari();
      await page.waitForTimeout(5_000);
      await expect(daftarMahasiswaPage.rowByName(expectedStudent)).toBeVisible();
    });
  });

  test('Admin filter mahasiswa by Program Studi', async ({ page, daftarMahasiswaPage }) => {
    await daftarMahasiswaPage.selectProgramStudi(filters.programStudi);
    await page.waitForTimeout(5_000);
    await daftarMahasiswaPage.expectColumnAllContains('Program Studi', filters.programStudi);
  });

  test('Admin filter mahasiswa by Jenjang Pendidikan', async ({ page, daftarMahasiswaPage }) => {
    await daftarMahasiswaPage.selectJenjang(filters.jenjang);
    await page.waitForTimeout(5_000);
    await daftarMahasiswaPage.expectColumnAllContains('Jenjang Mahasiswa', filters.jenjang);
  });

  test('Admin filter mahasiswa by Pengalaman', async ({ page, daftarMahasiswaPage }) => {
    await daftarMahasiswaPage.selectPengalaman(filters.pengalaman);
    await page.waitForTimeout(5_000);
    await daftarMahasiswaPage.expectColumnAllContains('Pengalaman', filters.pengalaman);
  });
});
