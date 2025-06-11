// tests/admin-filter-log.spec.ts
import { test, expect } from '@fixtures/PageFixtures';
import testData from 'test-data/admin-filter-log-per-matkul-data.json';

const { admin, filter, course, student, filterLog } = testData;

test.describe('Admin – Filter Mahasiswa di Log per Mata Kuliah', () => {
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

  test('Admin filter mahasiswa berdasarkan nama dan NPM', async ({ daftarLogMahasiswaPage, page }) => {
    await test.step('Admin mencari berdasarkan nama', async () => {
      await daftarLogMahasiswaPage.searchByName(student.name);
      await page.waitForTimeout(2_000);
    });

    await test.step('Cari berdasarkan NPM', async () => {
      await daftarLogMahasiswaPage.searchByNpm(student.id);
      await page.waitForTimeout(2_000);
    });
  });

  test('Admin filter mahasiswa berdasarkan status log', async ({ daftarLogMahasiswaPage, page }) => {
    await test.step('Admin mencari berdasarkan status log', async () => {
      await page.waitForTimeout(2_000);
      await daftarLogMahasiswaPage.filterStatus(filterLog.status);
      await page.waitForTimeout(2_000);
    });

    await test.step('Admin mencari berdasarkan status approval', async () => {
      await page.waitForTimeout(2_000);
      await daftarLogMahasiswaPage.filterApprovalType(filterLog.approvalStatus);
      await page.waitForTimeout(2_000);
    });

    await test.step('Admin mengurutkan berdasarkan nama', async () => {
      await page.waitForTimeout(2_000);
      await daftarLogMahasiswaPage.sortBy(filterLog.sortBy);
      await page.waitForTimeout(2_000);
    });
  });
});
