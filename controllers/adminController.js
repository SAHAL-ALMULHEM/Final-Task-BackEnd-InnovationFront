const Admin = require('../models/StudentModel');

const getAllUsers = async (req, res, next) => {
    const users = await Admin.find();
    res.status(200).json({users});
};

const getUserById = async (req, res, next) => {
    const id = req.params.id;
    const user = await Admin.findById(id);
    if (!user) {
        const error = new Error("User id not found");
        error.statusCode = 400;
        throw error;
    }
    res.status(200).json({user});
};

const creatUser = async (req, res, next) => {
    const data = req.body;
    const user = new Admin(data);
    await Admin.create(user);
    res.status(201).json({user});
};

const updateUser = async (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    const user = await Admin.findByIdAndUpdate(id, data, {new: true});
    if (!user) {
        const error = new Error("User id not found");
        error.statusCode = 404;
        throw error;
    }
    res.status(200).json({user});
};

const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    const user = await Admin.findByIdAndDelete(id);
    if (!user) {
        const error = new Error("User id not found");
        error.statusCode = 404;
        throw error;
    }
    res.status(204).json({message: 'user id deleted'});
};

module.exports = {
    getAllUsers,
    getUserById,
    creatUser,
    updateUser,
    deleteUser,
}