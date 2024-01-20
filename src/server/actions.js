const link = require('./create_connection')

class Actions {

  getData(req, res) {
    let sql = `SELECT * FROM bron`;
    link.query(sql, (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }
      // get  rows
      console.table(results);
      res.status(200).json(results);
    });
  };

  postData(req, res) {
    const sql = req.body.sql;
    console.log('SQL POST query recieved: ' + sql);
    link.query(sql, function (err, result, fields) {
      if (err) return res.status(422).json({message: err.message});
      console.table(result);
      res.status(200).json({result});
    });
  }
}

module.exports = new Actions();
