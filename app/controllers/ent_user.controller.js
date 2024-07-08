const entUserService = require("../services/ent_user.service");

const login = async (req, res) => {
  try {
    const { MaPMC, Password } = req.body;
    const reqData = {
      MaPMC: MaPMC,
      Password: Password,
    };
    const { token, user } = await entUserService.login(reqData);

    // Set token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    res.status(200).json({
      message: "Đăng nhập thành công",
      token: token,
      user: user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const register = async (req, res) => {
  try {
    const {
      Emails,
      Password,
      Hoten,
      MaPMC,
      Gioitinh,
      Diachi,
      Sodienthoai,
      Anh,
      ID_Nhompb,
      ID_Chinhanh,
      ID_Chucvu,
      Ghichu,
      UserName
    } = req.body;

    const data = {
      Emails,
      Password,
      Hoten,
      MaPMC : MaPMC ? MaPMC : UserName,
      Gioitinh,
      Diachi,
      Sodienthoai,
      Anh,
      ID_Nhompb,
      ID_Chinhanh,
      ID_Chucvu,
      Ghichu
    };

    const info = await entUserService.register(data);
    res.status(200).json(info);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const checkAuth = async (req, res) => {
  try{
    const userData = req.user.data;

    const info = await entUserService.checkAuth(userData.ID_User);
    res.status(200).json({
      message: "Thông tin cá nhân",
      data: info
    });
  }catch(error){
    res.status(400).json({ message: error.message });
  }
}

const changePassword = async (req, res) => {
  try {
    const user = req.user.data;
   
    const { currentPassword, newPassword } = req.body;
    const reqData = {
      user,
      currentPassword,
      newPassword,
    };
    await entUserService.changePassword(reqData);
 
    res.clearCookie('token');
    res.status(200).json({
      message: "Đổi mật khẩu thành công"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = req.user.data;
   
    const {
      Emails,
      Password,
      Hoten,
      MaPMC,
      Gioitinh,
      Diachi,
      Sodienthoai,
      Anh,
      ID_Nhompb,
      ID_Chinhanh,
      ID_Chucvu,
      Ghichu
    } = req.body;

    const images = req.file;
    
    const reqData = {
      user,
      images,
      Emails,
      Password,
      Hoten,
      MaPMC,
      Gioitinh,
      Diachi,
      Sodienthoai,
      Anh,
      ID_Nhompb,
      ID_Chinhanh,
      ID_Chucvu,
      Ghichu
    };

    await entUserService.updateProfile(reqData);
 
    res.status(200).json({
      message: "Cập nhật thông tin thành công"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  login,
  register,
  changePassword,
  updateProfile,
  checkAuth
};
