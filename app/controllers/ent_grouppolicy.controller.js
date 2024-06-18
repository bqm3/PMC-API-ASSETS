const entGroupPolicyService = require("../services/ent_grouppolicy.service");

const creatEnt_GroupPolicy = async (req, res) => {
    try {
        const { GroupPolicy } = req.body;
        const reqData = {
            GroupPolicy: GroupPolicy,
            isDelete: 0,
        };
        const data = await entGroupPolicyService.createEnt_GroupPolicy(reqData);
        res.status(200).json({
            message: "Tạo thành công",
            data: data,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllEnt_GroupPolicy = async (req, res) => {
    try {
        const data = await entGroupPolicyService.getAllEnt_GroupPolicy();
        res.status(200).json({
            message: "Danh sách",
            data: data,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEnt_GroupPolicy = async (req, res) => {
    try {
        const { GroupPolicy } = req.body;
        const ID_GroupPolicy = req.params.id;
        const data =  await entGroupPolicyService.updateEnt_GroupPolicy({
            ID_GroupPolicy: ID_GroupPolicy,
            GroupPolicy: GroupPolicy,
        });
        res.status(200).json({
            message: "Cập nhật thành công",
            data: data
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteEnt_GroupPolicy = async (req, res) => {
    try {
        const ID_GroupPolicy = req.params.id;
        await entGroupPolicyService.deleteEnt_GroupPolicy(ID_GroupPolicy);
        res.status(200).json({
            message: "Xóa thành công!",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    creatEnt_GroupPolicy,
    getAllEnt_GroupPolicy,
    updateEnt_GroupPolicy,
    deleteEnt_GroupPolicy
};
