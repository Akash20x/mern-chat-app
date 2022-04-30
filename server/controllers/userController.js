const Users = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (
            !name ||
            name.length <= 3 ||
            !email ||
            email.length <= 4 ||
            !email.includes("@") ||
            !password ||
            password.length <= 3
        ) {
            res.json({ msg: "Enter valid details", status: false });
            return;
        }
        if (await Users.findOne({ email })) {
            res.json({ msg: "User with email already exists", status: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Users.create({
            name,
            email,
            password: hashedPassword,
        });
        delete user.password;
        res.json({ msg: "User created", status: true, user: user });
    } catch (error) {
        console.log(error);
        res.json({
            msg: "Something went wrong please try again",
            status: false,
        });
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (
            !email ||
            email.length <= 4 ||
            !email.includes("@") ||
            !password ||
            password === null ||
            password.length <= 3
        ) {
            res.json({ msg: "Enter valid details", status: false });
            return;
        }
        const user = await Users.findOne({ email });
        if (!user) {
            res.json({
                msg: "No account found please register first",
                status: false,
            });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.json({
                msg: "email or password is incorrect",
                status: false,
            });
            return;
        }
        delete user["password"];
        return res.json({ msg: "User created", status: true, user: user });
    } catch (error) {
        console.log(error);
        return res.json({
            msg: "Something went wrong please try again",
            status: false,
        });
    }
};

//SETTING AVATAR TO USER

module.exports.setAvatar = async (req, res, next) => {
    try {
        const { image } = req.body;
        const { id } = req.params;
        await Users.findByIdAndUpdate(id, {
            isAvatarImage: true,
            avatarImage: image,
        });
        const user = await Users.findById(id);
        delete user.password;
        return res.json({
            msg: "Avatar set successfully",
            status: true,
            user: user,
        });
    } catch (error) {
        next(error);
    }
};

//GET ALL USERS

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await Users.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "name",
            "avatarImage",
            "_id",
        ]);
        return res.json({
            msg: "fetched all user",
            status: true,
            users: users,
        });
    } catch (error) {
        next(error);
    }
};

//SEARCH FRIEND
module.exports.searchFriend = async (req, res, next) => {
    try {
        const { searchQ, currentUserId } = req.body;
        const users = await Users.find({}).select([
            "_id",
            "name",
            "avatarImage",
            "friends",
        ]);
        const currentUser = await Users.findById(currentUserId);
        const userFriends = currentUser.friends;
        const foundUsers = users.filter((user) => {
            const notCurrentUser =
                user._id.toString() !== currentUserId.toString();
            if (notCurrentUser) {
                return user.name.includes(searchQ) && user;
            }
        });
        const notInFriends = foundUsers.filter((user) => {
            if (userFriends.includes(user._id) !== true) {
                return {
                    _id: user._id,
                    name: user.name,
                    avatarImage: user.avatarImage,
                };
            }
        });
        res.json({ users: notInFriends });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

//ADD FRIENDS
module.exports.addFriend = async (req, res, next) => {
    const { currentUserId, newFriendId } = req.body;
    try {
        if (Users.findById(newFriendId)) {
            await Users.findByIdAndUpdate(currentUserId, {
                $addToSet: { friends: newFriendId },
            });
            const user = await Users.findByIdAndUpdate(
                newFriendId,
                {
                    $addToSet: { friends: currentUserId },
                },
                { new: true }
            ).select(["_id", "name", "avatarImage"]);
            res.json({
                msg: "Added friend",
                status: true,
                user,
            });
        } else {
            res.json({ msg: "Can't find the user" });
        }
    } catch (error) {
        next(error);
    }
};

//GET ALL FRIENDS

module.exports.getAllFriends = async (req, res, next) => {
    try {
        const { id } = req.params;
        const friends = await Users.findById(id).populate("friends");
        res.json(friends);
    } catch (error) {
        next(error);
    }
};
