const tbTaisanQrCodeService = require("../services/tb_taisanqrcode.service");
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const axios = require('axios');

const createTb_Taisanqrcode = async (req, res) => {
  try {
    const { ID_Taisan, MaQrCode, Ngaykhoitao, iTinhtrang } =
      req.body;
    const reqData = {
      ID_Taisan: ID_Taisan || null,
      MaQrCode: MaQrCode || "",
      Ngaykhoitao: Ngaykhoitao || "",
      iTinhtrang: iTinhtrang || "",
      isDelete: 0,
    };
    const data = await tbTaisanQrCodeService.createTb_taisanqrcode(reqData);
    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailTb_Taisanqrcode = async(req, res) => {
  try {
    const ID_Taisan = req.params.id;
    const data = await tbTaisanQrCodeService.getDetailTb_taisanqrcode(ID_Taisan);
    res.status(200).json({
      message: "Thông tin",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getAllTb_Taisanqrcode = async (req, res) => {
  try {
    const data = await tbTaisanQrCodeService.getAllTb_taisanqrcode();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateleTb_Taisanqrcode = async (req, res) => {
  try {
    const { ID_Taisan, MaQrCode, Ngaykhoitao, iTinhtrang } = req.body;
    const ID_TaisanQr  = req.params.id;

    await tbTaisanQrCodeService.updateleTb_taisanqrcode({
      ID_Taisan: ID_Taisan || null,
      MaQrCode: MaQrCode || "",
      Ngaykhoitao: Ngaykhoitao || "",
      iTinhtrang: iTinhtrang || "",
      isDelete: 0,
      ID_TaisanQr: ID_TaisanQr
    });
    res.status(200).json({
      message: "Cập nhật thành công",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTb_Taisanqrcode = async (req, res) => {
  try {
    const ID_TaisanQr = req.params.id;
    await tbTaisanQrCodeService.deleteTb_taisanqrcode(ID_TaisanQr);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const scanQrCodeTb_Taisanqrcode = async(req, res) => {
  try {
    const { Ghichu, iTinhtrang } = req.body;
    const ID_TaisanQr  = req.params.id;
    const images = req.file;
    const user = req.user.data;


    const reqData = {
      Ghichu, iTinhtrang, ID_TaisanQr, images, user
    }

    // console.log(reqData)
    

    await tbTaisanQrCodeService.scanQrCodeTb_Taisanqrcode(reqData);
    res.status(200).json({
      message: "Kiểm kê tài sản thành công",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const qrFolder = path.join(__dirname, 'generated_qr_codes');

const generateAndSaveQrCodes = async (maQrCodes) => {
  // Create the directory if it doesn't exist
  if (!fs.existsSync(qrFolder)) {
    fs.mkdirSync(qrFolder, { recursive: true });
  }

  return Promise.all(
    maQrCodes.map(async (maQrCode) => {
      const sanitizedCode = maQrCode.replace(/[/\\?%*:|"<>]/g, '-'); // Replace characters not allowed in file names
      const url = `https://quickchart.io/qr?text=${encodeURIComponent(maQrCode)}&caption=${encodeURIComponent(maQrCode)}&size=300x300`;
      const imagePath = path.join(qrFolder, `qr_code_${sanitizedCode}.png`);

      try {
        const response = await axios({
          method: 'GET',
          url,
          responseType: 'stream',
        });

        await new Promise((resolve, reject) => {
          const writeStream = fs.createWriteStream(imagePath);
          response.data.pipe(writeStream);
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });

        return imagePath;
      } catch (error) {
        console.error(`Failed to generate QR code for ${maQrCode}:`, error);
        return { maQrCode, error: 'Failed to generate QR code' };
      }
    })
  );
};

const downloadQrCodes = async (req, res) => {
  const { maQrCodes } = req.query;

  if (!maQrCodes) {
    return res.status(400).json({ error: 'maQrCodes parameter is required' });
  }

  // Convert maQrCodes from a string to an array
  const maQrCodeArray = maQrCodes.split(',').map((code) => code.trim());

  try {
    await generateAndSaveQrCodes(maQrCodeArray);

    // Create a zip file
    const zipPath = path.join(__dirname, 'qr_codes.zip');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    output.on('close', () => {
      res.download(zipPath, 'qr_codes.zip', (err) => {
        if (err) {
          console.error('Error downloading the zip file:', err);
        } else {
          // Optionally, clean up the generated files
          fs.rmSync(qrFolder, { recursive: true, force: true });
          fs.unlinkSync(zipPath);
        }
      });
    });

    archive.on('error', (err) => {
      console.error('Error while archiving:', err);
      res.status(500).json({ error: 'Failed to archive QR codes' });
    });

    archive.pipe(output);
    archive.directory(qrFolder, false);
    await archive.finalize();
  } catch (error) {
    console.error('Failed to generate QR codes:', error);
    res.status(500).json({ error: 'Failed to generate QR codes' });
  }
};

const getDetailTb_Taisanqrcode1 = async(req, res) => {
  try {
    const ID_TaisanQrcode = req.params.id;
    const data = await tbTaisanQrCodeService.getDetailTb_Taisanqrcode1(ID_TaisanQrcode);
    res.status(200).json({
      message: "Thông tin",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



module.exports = {
  createTb_Taisanqrcode,
  getDetailTb_Taisanqrcode,
  getAllTb_Taisanqrcode,
  updateleTb_Taisanqrcode,
  deleteTb_Taisanqrcode,
  scanQrCodeTb_Taisanqrcode,
  downloadQrCodes,
  getDetailTb_Taisanqrcode1
};
