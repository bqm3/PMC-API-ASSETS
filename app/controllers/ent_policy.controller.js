const entGroupPolicyService = require("../services/ent_policy.service");

const createEnt_Policy = async (req, res) => {
  try {
    const { GroupPolicy, Policy,  ID_GroupPolicy } = req.body;
    const reqData = {
      GroupPolicy: GroupPolicy,
      Policy: Policy,
      ID_GroupPolicy: ID_GroupPolicy,
      isDelete: 0,
    };
    const data = await entGroupPolicyService.createEnt_Policy(reqData);
    res.status(200).json({
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllEnt_Policy = async (req, res) => {
  try {
    const data = await entGroupPolicyService.getAllEnt_Policy();
    res.status(200).json({
      message: "Danh sách",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEnt_Policy = async (req, res) => {
  try {
    const { GroupPolicy, Policy, ID_GroupPolicy } = req.body;
    const ID_Policy = req.params.id;
    await entGroupPolicyService.updateEnt_Policy({
      ID_Policy: ID_Policy,
      GroupPolicy: GroupPolicy,
      Policy: Policy,
      ID_GroupPolicy: ID_GroupPolicy,
    });
    res.status(200).json({
      message: "Cập nhật thành công",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEnt_Policy = async (req, res) => {
  try {
    const ID_Policy = req.params.id;
    await entGroupPolicyService.deleteEnt_Policy(ID_Policy);
    res.status(200).json({
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEnt_Policy,
  getAllEnt_Policy,
  updateEnt_Policy,
  deleteEnt_Policy,
};
