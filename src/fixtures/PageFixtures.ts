import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/login/LoginPage';
import { DaftarLowonganPage } from '@pages/lowongan/DaftarLowonganPage';
import { LogAsistensiPerMatkulPage } from '../pages/log/LogAsistensiPerMatkulPage';
import { DaftarLogMahasiswaPage } from '../pages/log/DaftarLogMahasiswaPage';
import { DaftarMahasiswaPage } from '@src/pages/mahasiswa/DaftarMahasiswaPage';

type Fixtures = {
    loginPage: LoginPage;
    daftarLowonganPage: DaftarLowonganPage;
    logAsistensiPerMatkulPage: LogAsistensiPerMatkulPage;
    daftarLogMahasiswaPage: DaftarLogMahasiswaPage;
    daftarMahasiswaPage: DaftarMahasiswaPage;
}

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  
  daftarLowonganPage: async ({ page }, use) => {
      const daftarLowonganPage = new DaftarLowonganPage(page);
      await use(daftarLowonganPage);
  },

  logAsistensiPerMatkulPage: async ({ page }, use) => {
      const logAsistensiPerMatkulPage = new LogAsistensiPerMatkulPage(page);
      await use(logAsistensiPerMatkulPage);
  },

  daftarLogMahasiswaPage: async ({ page }, use) => {
      const daftarLogMahasiswaPage = new DaftarLogMahasiswaPage(page);
      await use(daftarLogMahasiswaPage);
  },
  daftarMahasiswaPage: async ({ page }, use) => {
      const daftarMahasiswaPage = new DaftarMahasiswaPage(page);
      await use(daftarMahasiswaPage);
  },
});

export { expect } from '@playwright/test';