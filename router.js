function route(handle, pathname, response, postData) {
  console.log("Début du traitement de l'URL " + pathname + ".");
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, postData);
  } else {
    console.log("Aucun gestionnaire associé à " + pathname);
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Non trouvé");
    response.end();
  }
}

exports.route = route;
