const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Applicant = require('../models/application');


const checkAdmin = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.redirect('/admin/sign-in');
    }

    jwt.verify(token, process.env.TOKEN_SECRET, async (error, decodedToken) => {
        if (error) {
            // Handle both token expiration and any other errors
            return res.redirect('/admin/sign-in');
        }

        try {
            const _admin = await Admin.findOne({_id: decodedToken.id}, {password: 0});
            if (_admin) {
                req.admin = decodedToken.id;  // Assign admin ID to request object
                res.locals.admin = _admin;    // Assign admin object to local variables for views
                next();
            } else {
                res.locals.admin = null;
                return res.redirect('/admin/sign-in');
            }
        } catch (err) {
            // Handle possible database errors
            console.error(err);
            return res.redirect('/admin/sign-in');
        }
    });
};

const checkApplicant = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.redirect('/sign-in');
    }

    jwt.verify(token, process.env.TOKEN_SECRET, async (error, decodedToken) => {
        if (error) {
            // Handle both token expiration and any other errors
            return res.redirect('/sign-in');
        }

        try {
            const _applicant = await Applicant.findOne({_id: decodedToken.id}, {password: 0});
            if (_applicant) {
                req.applicant = decodedToken.id;  // Assign applicant ID to request object
                res.locals.applicant = _applicant;    // Assign applicant object to local variables for views
                next();
            } else {
                res.locals.applicant = null;
                return res.redirect('/sign-in');
            }
        } catch (err) {
            // Handle possible database errors
            console.error(err);
            return res.redirect('/sign-in');
        }
    });
};

module.exports = { checkAdmin, checkApplicant };
