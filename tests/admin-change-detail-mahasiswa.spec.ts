import { test, expect } from '@fixtures/PageFixtures';
import testData from 'test-data/admin-change-detail-mahasiswa-data.json';

const { admin, students, changes } = testData;
const targetStudent = students[0].name;
const mahasiswaNames = students.map((s) => s.name);
const { jenjang: singleJenjang, pengalaman: singleExp } = changes.single;
const { jenjang: bulkJenjang, pengalaman: bulkExp } = changes.bulk;

test.describe('Admin Ubah Detail Mahasiswa di Daftar Mahasiswa', () => {
  /* ═════════ PRE-CONDITION ═════════ */
  test.beforeEach(async ({ loginPage, page, daftarMahasiswaPage }) => {
    // 1) Login
    await loginPage.open();
    await loginPage.login(admin.username, admin.password);
    await expect(page).toHaveURL(/admin\/dashboard/);

    // 2) Halaman Daftar Mahasiswa
    await daftarMahasiswaPage.open();
    await expect(page.getByText('Daftar Mahasiswa')).toBeVisible();
  });

  test('Admin mengubah jenjang satu mahasiswa', async ({ page, daftarMahasiswaPage }) => {
    await test.step(`Cari ${targetStudent}`, async () => {
      await daftarMahasiswaPage.typeSearch(targetStudent);
      await daftarMahasiswaPage.clickCari();
      await page.waitForTimeout(5_000);
      await expect(daftarMahasiswaPage.rowByName(targetStudent)).toBeVisible();
    });

    await test.step('Ubah Jenjang', async () => {
      await daftarMahasiswaPage.changeJenjang(targetStudent, singleJenjang);
      await daftarMahasiswaPage.confirmJenjangChange();
      await daftarMahasiswaPage.waitForSuccessToast('berhasil');
    });

    await test.step('Verifikasi perubahan', async () => {
      const info = await daftarMahasiswaPage.getRowInfo(targetStudent);
      expect(info.jenjang).toBe(singleJenjang);
    });
  });

  test('Admin mengubah pengalaman satu mahasiswa', async ({ page, daftarMahasiswaPage }) => {
    await test.step(`Cari ${targetStudent}`, async () => {
      await daftarMahasiswaPage.typeSearch(targetStudent);
      await daftarMahasiswaPage.clickCari();
      await page.waitForTimeout(5_000);
      await expect(daftarMahasiswaPage.rowByName(targetStudent)).toBeVisible();
    });

    await test.step('Ubah Pengalaman', async () => {
      await daftarMahasiswaPage.changePengalaman(targetStudent, singleExp);
      await daftarMahasiswaPage.confirmPengalamanChange();
      await daftarMahasiswaPage.waitForSuccessToast('berhasil');
    });

    await test.step('Verifikasi perubahan', async () => {
      const info = await daftarMahasiswaPage.getRowInfo(targetStudent);
      expect(info.pengalaman).toBe(singleExp);
    });
  });

  test('Admin mengubah jenjang mahasiswa secara masal', async ({ page, daftarMahasiswaPage }) => {
    await test.step('Pilih mahasiswa', async () => {
      for (const name of mahasiswaNames) {
        await daftarMahasiswaPage.typeSearch(name);
        await daftarMahasiswaPage.clickCari();
        await page.waitForTimeout(5_000);
        await expect(daftarMahasiswaPage.rowByName(name)).toBeVisible();
        await daftarMahasiswaPage.selectRows([name]);
        await page.waitForTimeout(500);
      }
    });

    await test.step('Bulk-edit Jenjang', async () => {
      await daftarMahasiswaPage.bulkChangeJenjang(bulkJenjang);
      await daftarMahasiswaPage.confirmJenjangChange();
      await daftarMahasiswaPage.waitForSuccessToast('berhasil');
    });

    await test.step('Verifikasi Jenjang', async () => {
      for (const name of mahasiswaNames) {
        await daftarMahasiswaPage.typeSearch(name);
        await daftarMahasiswaPage.clickCari();
        await page.waitForTimeout(5_000);
        const info = await daftarMahasiswaPage.getRowInfo(name);
        expect(info.jenjang).toBe(bulkJenjang);
      }
    });
  });

  test('Admin mengubah pengalaman mahasiswa secara masal', async ({ page, daftarMahasiswaPage }) => {
    await test.step('Pilih mahasiswa', async () => {
      for (const name of mahasiswaNames) {
        await daftarMahasiswaPage.typeSearch(name);
        await daftarMahasiswaPage.clickCari();
        await page.waitForTimeout(5_000);
        await daftarMahasiswaPage.selectRows([name]);
        await page.waitForTimeout(500);
      }
    });

    await test.step('Bulk-edit Pengalaman', async () => {
      await daftarMahasiswaPage.bulkChangePengalaman(bulkExp);
      await daftarMahasiswaPage.confirmPengalamanChange();
      await daftarMahasiswaPage.waitForSuccessToast('berhasil');
    });

    await test.step('Verifikasi Pengalaman', async () => {
      for (const name of mahasiswaNames) {
        await daftarMahasiswaPage.typeSearch(name);
        await daftarMahasiswaPage.clickCari();
        await page.waitForTimeout(5_000);
        const info = await daftarMahasiswaPage.getRowInfo(name);
        expect(info.pengalaman).toBe(bulkExp);
      }
    });
  });
});
