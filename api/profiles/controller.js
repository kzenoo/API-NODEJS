const Profile = require('./model');

exports.getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find();
        res.json(profiles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProfileById = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ error: "Profil non trouvé" });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) return res.status(400).json({ error: "Nom et email requis" });

        const newProfile = new Profile({ name, email });
        await newProfile.save();
        res.status(201).json(newProfile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const profile = await Profile.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
        if (!profile) return res.status(404).json({ error: "Profil non trouvé" });

        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const profile = await Profile.findByIdAndDelete(req.params.id);
        if (!profile) return res.status(404).json({ error: "Profil non trouvé" });

        res.json({ message: "Profil supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addExperience = async (req, res) => {
    try {
        const { title, company, dates, description } = req.body;
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ error: "Profil non trouvé" });

        profile.experience.push({ title, company, dates, description });
        await profile.save();
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removeExperience = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ error: "Profil non trouvé" });

        profile.experience = profile.experience.filter(exp => exp._id.toString() !== req.params.exp);
        await profile.save();
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addSkill = async (req, res) => {
    try {
        const { skill } = req.body;
        if (!skill) return res.status(400).json({ error: "Compétence requise" });

        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ error: "Profil non trouvé" });

        profile.skills.push(skill);
        await profile.save();
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removeSkill = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ error: "Profil non trouvé" });

        profile.skills = profile.skills.filter(s => s !== req.params.skill);
        await profile.save();
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateInformation = async (req, res) => {
    try {
        const { bio, location, website } = req.body;
        const profile = await Profile.findByIdAndUpdate(req.params.id, { information: { bio, location, website } }, { new: true });
        if (!profile) return res.status(404).json({ error: "Profil non trouvé" });

        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllProfiles = async (req, res) => {
    try {
        const { name, email, skill, location } = req.query;
        let filter = {};

        if (name) filter.name = { $regex: name, $options: 'i' };
        if (email) filter.email = { $regex: email, $options: 'i' };
        if (skill) filter.skills = { $in: [skill] };
        if (location) filter['information.location'] = { $regex: location, $options: 'i' };

        const profiles = await Profile.find(filter);
        res.json(profiles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const profile = await Profile.findById(req.params.id);
        const friend = await Profile.findById(friendId);

        if (!profile || !friend) return res.status(404).json({ error: "Profil ou ami non trouvé" });
        if (profile.friends.includes(friendId)) return res.status(400).json({ error: "Cet utilisateur est déjà ami" });

        profile.friends.push(friendId);
        await profile.save();
        res.json({ message: "Ami ajouté avec succès", profile });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removeFriend = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ error: "Profil non trouvé" });

        profile.friends = profile.friends.filter(friend => friend.toString() !== req.params.friendId);
        await profile.save();
        res.json({ message: "Ami supprimé avec succès", profile });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFriends = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id).populate('friends', 'name email _id');
        if (!profile) return res.status(404).json({ error: "Profil non trouvé" });

        res.json(profile.friends);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
