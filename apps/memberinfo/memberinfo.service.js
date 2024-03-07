const { DB_PREFIX, SITE_DIR } = require("config");
const doDBQuery = require("_helpers/do-query");
const path = require("path");
const fs = require("fs");
const pdf = require("pdfjs");
const fonts = require("pdfjs/font/Helvetica");

module.exports = {
	getAll,
	makeLabels,
};

async function getAll() {
	const sql = `SELECT
					a.account_id,
					concat(a.member_lastname,", ",a.member_firstname) as name,
					a.account_addr_phone,
					a.account_email,
					a.account_email_opening,
					a.newsletter_recipient,
					a.mail_recipient,
					a.account_addr_street,
					a.member_type_id,
					a.status,
					a.deleted,
					a.created_dt,
					a.modified_dt,
					a.modified_dt as dt,
					(
						SELECT
							COUNT(*)
						FROM
							${DB_PREFIX}contributions c
						WHERE
							c.account_id = a.account_id
					) as donation_cnt
				FROM
					${DB_PREFIX}accounts a
				WHERE
					a.deleted = 0
					AND
					a.status = 1
				ORDER BY
					name ASC`;

	accounts = await doDBQuery(sql);
	return accounts;
}

async function makeLabels({ labelType, member_type_id }) {

	const sql = `SELECT
					member_lastname,
					concat(member_firstname," ",member_lastname) as name,
					account_addr_street,
					account_addr_street_ext,
					concat(account_addr_city,", ",account_addr_state," ",account_addr_postal) as citystzip
				FROM
					${DB_PREFIX}accounts
				WHERE
					deleted = 0
					AND
					status = 1
					AND
					member_type_id = ${member_type_id}
					AND
					mail_recipient = 1
				ORDER BY
					member_lastname ASC`;

	const accounts = await doDBQuery(sql);

	// available variables: pdf, fonts, logo, lorem
	const doc = new pdf.Document({
		font: fonts.Helvetica,
		width: 612,
		height: 792,
		paddingTop: 36,
		paddingBottom: 36,
		paddingLeft: 15,
		paddingRight: 15,
	});

	if (labelType === "5160") {

		const table = doc.table({
			widths: [189, 9, 189, 9, 189],
		});

		// function addRow ****
		function addRow5160(labelInfo1, labelInfo2, labelInfo3) {
			// cell options
			const options = {
				minHeight: 71,
				padding: 10,
			};
			const optsAdd = {
				font: fonts.HelveticaBold,
				fontSize: 10,
			};

			const tr = table.row();

			tr.cell(options).text(optsAdd).add(labelInfo1);
			tr.cell("");
			tr.cell(options).text(optsAdd).add(labelInfo2);
			tr.cell("");
			tr.cell(options).text(optsAdd).add(labelInfo3);
		}

		let i = 0;
		const cnt = accounts.length;
		for (i = 0; i < cnt; i += 3) {
			let labelInfo1 = "";
			let c = i;
			let name = accounts[c].name;
			let street = accounts[c].account_addr_street;
			let street_ext = accounts[c].account_addr_street_ext;
			let citystzip = accounts[c].citystzip;
			if (street_ext === "") {
				labelInfo1 = `${name}\n${street}\n${citystzip}`;
			} else {
				labelInfo1 = `${name}\n${street}\n${street_ext}\n${citystzip}`;
			}
			c++;
			let labelInfo2 = "";
			if (cnt > c) {
				name = accounts[c].name;
				street = accounts[c].account_addr_street;
				street_ext = accounts[c].account_addr_street_ext;
				citystzip = accounts[c].citystzip;
				if (street_ext === "") {
					labelInfo2 = `${name}\n${street}\n${citystzip}`;
				} else {
					labelInfo2 = `${name}\n${street}\n${street_ext}\n${citystzip}`;
				}
			} else {
				labelInfo2 = `blank`;
			}
			c++;
			let labelInfo3 = "";
			if (cnt > c) {
				name = accounts[c].name;
				street = accounts[c].account_addr_street;
				street_ext = accounts[c].account_addr_street_ext;
				citystzip = accounts[c].citystzip;
				if (street_ext === "") {
					labelInfo3 = `${name}\n${street}\n${citystzip}`;
				} else {
					labelInfo3 = `${name}\n${street}\n${street_ext}\n${citystzip}`;
				}
			} else {
				labelInfo3 = `blank`;
			}
			addRow5160(labelInfo1, labelInfo2, labelInfo3);
		}
	} else if (labelType === "5164") {

		const table = doc.table({
			widths: [285, 15, 285],
		});

		const logo = new pdf.Image(
			// fs.readFileSync(`${SITE_DIR}/public/crabbies.png`)
			fs.readFileSync('/home/rastridge/my-test-site.net/public/crabbies.jpg')
		);

		// function addRow ****
		function addRow5164(labelInfo1, labelInfo2) {

			const options = {
				minHeight: 240,
				padding: 15,
			};
			const optsAdd = {
				font: fonts.HelveticaBold,
				fontSize: 12,
				alignment: "center",
				backgroundColor: 0xeeeeee,
			};
			const blankline = {
				fontSize: 6,
				alignment: "right",
			};

			const tr = table.row();

			const td1 = tr.cell(options);
			td1.image(logo, { height: 80, align: "center" });
			td1.text(". ", blankline);
			td1.text("Return: 293 Washington Hwy, Buffalo, NY 14226", {
				fontSize: "10",
				alignment: "center",
			});
			td1.text(". ", blankline);
			td1.text(". ", blankline);
			td1.text(labelInfo1, optsAdd);

			const td2 = tr.cell();
			td2.text("");

			const td3 = tr.cell(options);
			td3.image(logo, { height: 80, align: "center" });
			td3.text(". ", blankline);
			td3.text("Return: 293 Washington Hwy, Buffalo, NY 14226", {
				fontSize: "10",
				alignment: "center",
			});
			td3.text(". ", blankline);
			td3.text(". ", blankline);
			td3.text(labelInfo2, optsAdd);
		}

		let i = 0;
		const cnt = accounts.length;
		for (i = 0; i < cnt; i += 2) {
			let labelInfo1 = "";
			let c = i;
			let name = accounts[c].name;
			let street = accounts[c].account_addr_street;
			let street_ext = accounts[c].account_addr_street_ext;
			let citystzip = accounts[c].citystzip;
			if (street_ext === "") {
				labelInfo1 = `${name}\n${street}\n${citystzip}`;
			} else {
				labelInfo1 = `${name}\n${street}\n${street_ext}\n${citystzip}`;
			}

			c++;
			let labelInfo2 = "";
			if (cnt > c) {
				name = accounts[c].name;
				street = accounts[c].account_addr_street;
				street_ext = accounts[c].account_addr_street_ext;
				citystzip = accounts[c].citystzip;
				if (street_ext === "") {
					labelInfo2 = `${name}\n${street}\n${citystzip}`;
				} else {
					labelInfo2 = `${name}\n${street}\n${street_ext}\n${citystzip}`;
				}
			} else {
				labelInfo2 = `blank`;
			}

			addRow5164(labelInfo1, labelInfo2);

		}
	}

	doc.pipe(
		fs.createWriteStream(`${SITE_DIR}/public/templabels/avery${labelType}.pdf`)
	);

	await doc.end();
	return `/templabels/avery${labelType}.pdf`;
}
