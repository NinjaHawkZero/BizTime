const express = require("express");
const ExpressError = require("../expressError")
const db = require("../db");

let router = new express.Router();

//Get all industries
router.get('/', async function (req, res, next) {
    try {
        const result = await db.query (
            `SELECT i.code, i.industry, c.code
            FROM industry as i
            LEFT JOIN industry_company AS ic
            ON i.code = ic.ind_code
            LEFT JOIN companies AS c
            ON ic.comp_code = c.code `
        );

        return res.json({'industries': result.rows});
    }

    catch (err) {
        return next(err);
    }
});


router.post('/', async function (req, res, next) {
    try {
        let {comp_code, ind_code} = req.body;

        const result = await db.query(
            `INSERT INTO industry_company (comp_code, ind_code)
            VALUES ($1, $2)
            RETURNING comp_code, ind_code`,
            [comp_code, ind_code]
        );
        
        return res.status(201).json({'industry_company': result.rows[0]});
    }

    catch (err) {
        return next(err);
    }
});
