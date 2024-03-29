const signupSchema = require("../utils/validations/signupSchema");
const loginSchema = require("../utils/validations/loginSchema");
const setCookie = require("../utils/setCookie");

class AuthController {
    constructor(authService) {
        this.authService = authService;
    };

    async checkAuth(req, res) {
        const { role } = req.query;
        const token = role === "admin" ?
            req.cookies.adminJwt :
            req.cookies.userJwt;

        // Call the checkAuth method of the AuthService instance
        const response = await this.authService.checkAuth(token);

        // Send a success response
        res.status(200).json({
            status: 200,
            message: "Authentication successful",
            userData: response.data.currentUser
        });
    };

    async login(req, res) {
        await loginSchema.validate(req.body);

        const { username, password } = req.body;

        // Call authService.login()
        const result = await this.authService.login(username, password);

        if (result.status === 200) {
            const role = result.data.currentUser.role;
            const cookieName = role === "admin" ? "adminJwt" : "userJwt";
            setCookie(res, cookieName, result.data.token);
        }

        // Send a success response
        res.status(200).json({
            status: 200,
            message: "Authentication successful",
            userData: result.data.currentUser
        });
    };

    async signUp(req, res) {
        await signupSchema.validate(req.body);

        // Call authService.login()
        const result = await this.authService.signUp(req.body);

        if (result.status === 200) {
            const role = result.data.currentUser.role;
            const cookieName = role === "admin" ? "adminJwt" : "userJwt";
            setCookie(res, cookieName, result.data.token);
        }

        // Send a success response
        res.status(200).json({
            status: 200,
            message: "Authentication successful",
            userData: result.data.currentUser
        });
    };

    async logout(req, res) {
        const { role } = req.body;
        if (role === "admin") {
            setCookie(res, "adminJwt", "", { maxAge: 0 });
        } else {
            setCookie(res, "userJwt", "", { maxAge: 0 });
        }
        res.status(200).json({
            status: 200,
            message: "Logged out successfully"
        });
    };
};

module.exports = AuthController;
