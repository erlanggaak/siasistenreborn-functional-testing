// tests/admin-change-detail-mahasiswa.spec.ts
import { test, expect } from '@fixtures/PageFixtures';
import { validAdmin } from '../src/fixtures/credentials';

test.describe('Admin Change Detail Mahasiswa di Halaman Daftar List Mahasiswa', () => {
  /* ═════════ PRE-CONDITION ═════════ */
  test.beforeEach(async ({ loginPage, page, daftarMahasiswaPage }) => {
    // 1) Login
    await loginPage.open();
    await loginPage.login(validAdmin.username, validAdmin.password);
    await expect(page).toHaveURL(/admin\/dashboard/);

    // 2) Buka halaman Daftar Mahasiswa
    await daftarMahasiswaPage.open();
    await expect(page.getByText('Daftar Mahasiswa')).toBeVisible();
  });

  test('Admin mengubah jenjang pendidikan mahasiswa', async ({ page, daftarMahasiswaPage }) => {
    await test.step('Admin mencari mahasiswa Adiarja Halim', async () => {
      await daftarMahasiswaPage.typeSearch('Adiarja Halim');
      await daftarMahasiswaPage.clickCari();
      await page.waitForTimeout(5000);
      await expect(
        daftarMahasiswaPage.rowByName('Adiarja Halim')
      ).toBeVisible();
    });

    await test.step('Admin mengubah jenjang mahasiswa Adiarja Halim', async () => {
      await daftarMahasiswaPage.changeJenjang('Adiarja Halim', 'Mahasiswa S1');
      await daftarMahasiswaPage.confirmJenjangChange();
      await daftarMahasiswaPage.waitForSuccessToast('berhasil');
    });

    await test.step('Admin mengubah pengalaman Adiarja Halim', async () => {
      await daftarMahasiswaPage.changePengalaman('Adiarja Halim', 'Senior');
      await daftarMahasiswaPage.confirmPengalamanChange();
      await daftarMahasiswaPage.waitForSuccessToast('berhasil');
    });

    await test.step('Admin memverifikasi Jenjang dan Pengalaman terbaru', async () => {
      const info = await daftarMahasiswaPage.getRowInfo('Adiarja Halim');
      expect(info.jenjang).toBe('Mahasiswa S1');
      expect(info.pengalaman).toBe('Senior');
    });
  });

  test('Admin mengubah jenjang mahasiswa secara masal', async ({ page, daftarMahasiswaPage }) => {
    const mahasiswaNames = [
      'Adiarja Halim',
      'Naira Haura',
      'Erlangga Ahmad Khadafi'
    ];  

    await test.step('Admin mencari mahasiswa dan klik checkbox yang ingin diubah secara masal', async () => {
      for (const name of mahasiswaNames) {
        await daftarMahasiswaPage.typeSearch(name);
        await daftarMahasiswaPage.clickCari();
        await page.waitForTimeout(5000);
        await expect(
          daftarMahasiswaPage.rowByName(name)
        ).toBeVisible();

        await daftarMahasiswaPage.selectRows([name]);
        await page.waitForTimeout(500);
      }
    });

    await test.step('Admin mengubah jenjang mahasiswa secara masal', async () => {
      await daftarMahasiswaPage.bulkChangeJenjang('Mahasiswa S1');
      await daftarMahasiswaPage.confirmJenjangChange();
      await daftarMahasiswaPage.waitForSuccessToast('berhasil');
    });

    await test.step('Admin memverifikasi jenjang terbaru', async () => {
      for (const name of mahasiswaNames) {
        await daftarMahasiswaPage.typeSearch(name);
        await daftarMahasiswaPage.clickCari();
        await page.waitForTimeout(5000);
        await expect(
          daftarMahasiswaPage.rowByName(name)
        ).toBeVisible();

        const info = await daftarMahasiswaPage.getRowInfo(name);
        expect(info.jenjang).toBe('Mahasiswa S1');
      }
    });
  });

  test('Admin mengubah pengalaman mahasiswa secara masal', async ({ page, daftarMahasiswaPage }) => {
    const mahasiswaNames = [
      'Adiarja Halim',
      'Naira Haura',
      'Erlangga Ahmad Khadafi'
    ];  

    await test.step('Admin mencari mahasiswa dan klik checkbox yang ingin diubah secara masal', async () => {
      for (const name of mahasiswaNames) {
        await daftarMahasiswaPage.typeSearch(name);
        await daftarMahasiswaPage.clickCari();
        await page.waitForTimeout(5000);
        await expect(
          daftarMahasiswaPage.rowByName(name)
        ).toBeVisible();

        await daftarMahasiswaPage.selectRows([name]);
        await page.waitForTimeout(500);
      }
    });

    await test.step('Admin mengubah pengalaman mahasiswa secara masal', async () => {
      await daftarMahasiswaPage.bulkChangePengalaman('Junior');
      await daftarMahasiswaPage.confirmPengalamanChange();
      await daftarMahasiswaPage.waitForSuccessToast('berhasil');
    });

    await test.step('Admin memverifikasi pengalaman terbaru', async () => {
      for (const name of mahasiswaNames) {
        await daftarMahasiswaPage.typeSearch(name);
        await daftarMahasiswaPage.clickCari();
        await page.waitForTimeout(5000);
        await expect(
          daftarMahasiswaPage.rowByName(name)
        ).toBeVisible();

        const info = await daftarMahasiswaPage.getRowInfo(name);
        expect(info.pengalaman).toBe('Junior');
      }
    });
  });
});
