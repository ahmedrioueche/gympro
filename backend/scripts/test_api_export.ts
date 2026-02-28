import axios from 'axios';
import * as exceljs from 'exceljs';
import * as fs from 'fs';

async function testExport() {
  try {
    const loginRes = await axios.post(
      'http://localhost:3000/api/auth/signin',
      {
        login: process.env.ADMIN_EMAIL || 'admin@gympro.com',
        password: process.env.ADMIN_PASSWORD || 'admin',
      },
      {
        validateStatus: () => true,
      },
    );

    console.log('Login Status:', loginRes.status);
    const setCookie = loginRes.headers['set-cookie'];
    if (!setCookie) {
      console.log('No cookie received!');
      return;
    }

    console.log('Requesting export...');
    const exportRes = await axios.get('http://localhost:3000/api/gyms/export', {
      responseType: 'arraybuffer',
      headers: {
        Cookie: setCookie ? setCookie.join('; ') : '',
      },
      validateStatus: () => true,
    });

    console.log('Export Status:', exportRes.status);
    if (exportRes.status === 200) {
      const buffer = exportRes.data;
      fs.writeFileSync('test_export_output.xlsx', buffer);

      const workbook = new exceljs.Workbook();
      await workbook.xlsx.load(buffer);

      console.log(
        'Sheets found:',
        workbook.worksheets.map((s) => s.name),
      );

      const membersSheet = workbook.getWorksheet('Members');
      if (membersSheet) {
        let count = 0;
        membersSheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            count++;
          } // Skip header
        });
        console.log(`Members sheet row count (excluding header): ${count}`);
      } else {
        console.log('Members sheet is missing!');
      }
    } else {
      console.log('Export failed:', exportRes.data.toString('utf-8'));
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

testExport();
