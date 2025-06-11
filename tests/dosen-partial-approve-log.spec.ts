import { test, expect } from '@fixtures/PageFixtures';
import { validDosen, validMahasiswa } from '../src/fixtures/credentials';

test.describe('Dosen Partial Approve Log', () => {
  test('Dosen Partial Approve Log', async ({ loginPage, page, logAsistensiPerMatkulPage, daftarLogMahasiswaPage }) => {
    await test.step('Dosen melakukan login', async () => {
        await loginPage.open();
        await loginPage.login(validDosen.username, validDosen.password);
        await expect(page).toHaveURL(/lowongan/);
    });

    await test.step('Dosen pergi ke halaman Log', async () => {
        await logAsistensiPerMatkulPage.open();
    });

    await test.step('Dosen membuka log mata kuliah tertentu', async () => {
        await logAsistensiPerMatkulPage.goToCourseLogs('CSCM603228');
        await expect(page).toHaveURL(/\/matkul\/\d+\/log$/);
    });

    await test.step('Dosen menyetujui sebagian durasi log', async () => {
        await daftarLogMahasiswaPage.partialApprove("Naira Haura", "asist 23");
        await page.waitForTimeout(2000);
        await daftarLogMahasiswaPage.fillPartialApproveForm(30, "Partial approval for testing");
    });
  });
});

