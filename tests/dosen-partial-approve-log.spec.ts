import { test, expect } from '@fixtures/PageFixtures';
import testData from 'test-data/dosen-partial-approve-log-data.json';

const { admin, dosen, course, studentLog, filter } = testData;

test.describe('Dosen – Partial Approve Log', () => {
  /* ═════════ PRE-CONDITION ═════════ */
  test.beforeEach(async ({ loginPage, page, logAsistensiPerMatkulPage }) => {
    await test.step('Login sebagai admin', async () => {
      await loginPage.open();
      await loginPage.login(admin.username, admin.password);
      await expect(page).toHaveURL(/admin\/dashboard/);
    });

    await test.step('Admin memuka halaman Log & filter semester', async () => {
      await logAsistensiPerMatkulPage.open();
      await logAsistensiPerMatkulPage.selectTerm(filter.term);
      await page.waitForTimeout(2000);
    });

    await test.step('Admin membuka log untuk mata kuliah tertentu', async () => {
      await logAsistensiPerMatkulPage.goToCourseLogs(course.code);
      await expect(page).toHaveURL(/\/matkul\/\d+\/log$/);
    });
  });

  test('Admin menyetujui sebagian durasi log', async ({page, daftarLogMahasiswaPage}) => {
    await test.step('Admin menyetujui log secara parsial', async () => {
      await daftarLogMahasiswaPage.partialApprove(studentLog.name, studentLog.date, studentLog.time);
      await page.waitForTimeout(2_000);
    });

    await test.step('Admin mengisi durasi yang disetujui dan pesannya', async () => {
      await daftarLogMahasiswaPage.fillPartialApproveForm(studentLog.partialMinutes, studentLog.partialReason);
    });

    await test.step('Admin menekan tombol Setujui Parsial', async () => {
      await daftarLogMahasiswaPage.submitPartialApprove();
      await page.waitForTimeout(2_000);
    });

  });
});
