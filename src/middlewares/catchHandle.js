const catchHandle = fn => (req, res, next) => {
  fn(req, res, next).catch(err => {
    console.log(`======= catchProcessHandle:${req.originalUrl}`, err)
    return res.send({error: err})
  });
}

export default catchHandle