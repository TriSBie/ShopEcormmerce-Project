const { Router } = require("express");
x
/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 *
 */

const router = Router();
router.get("/", (req, res) => {

})

/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the student
 *         schema:
 *           type: string
 *         example:
 *             658918e852a0131af4c0aab1
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               data: [{}]
 *       404:
 *         description: Student not found
 */


//Get the Student
router.get("/student/:id", getStudent);

/**
 * @swagger
 * /student:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       description: Student object to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               dateOfBirth:
 *                 type: date
 *               gender:
 *                 type: string
 *               phoneNum:
 *                 type: integer
 *             example:
 *                name: "John Doe"
 *                address: "Colombo - Srilanka "
 *                dateOfBirth: 07/14/1990
 *                gender: "male"
 *                phoneNum: 01145252525
 *     responses:
 *       201:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               data: [{}]
 *       400:
 *         description: Invalid request
 */


//Create Student
router.post("/student", createStudent);
/**
 * @swagger
 * /student/{id}:
 *   put:
 *     summary: Update a student by ID
 *     description: Update the details of a student by providing the student ID.
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the student to be updated.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated student information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               phoneNum:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successful update
 *         content:
 *           application/json:
 *             example:
 *               message: 'Student updated successfully'
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             example:
 *               message: 'Student not found'
 */


//put the Student
router.put("/student/:id", updateStudent);

module.exports = router;