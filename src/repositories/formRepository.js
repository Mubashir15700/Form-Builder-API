const Form = require("../models/Form");

class FormRepository {
    async isFormTitleUnique(userId, title) {
        return await Form.findOne({ title, creatorId: userId });
    };

    async createForm(creatorId, formTitle, formDescription, formElements) {
        // Create a new Form document
        const newForm = new Form({
            creatorId,
            title: formTitle,
            description: formDescription,
            formElements: formElements
        });

        // Save the document to the database
        return await newForm.save();
    };

    async getForms(creatorId) {
        return await Form.find({ creatorId }).sort({ createdAt: -1 });
    };

    async getForm(id) {
        return await Form.findById(id);
    };
};

module.exports = FormRepository;
