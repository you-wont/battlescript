var request = require('request');

module.exports = {
  getDuel: function(req, res) {
    var options = {
      url: 'https://www.codewars.com/api/v1/code-challenges/5513795bd3fafb56c200049e/javascript/train',
      headers: {
        'Authorization': 'TFp2KBBKWkDu_qCRyByVz'
      }
    };
    
    request.post(options, function(error, response, body) {
      res.send(response);
    });
  },

  attemptDuel: function(req, res) {
    // Init a poll counter, so that if we poll too many times, it times out.
    var pollCounter = 0;
    
    // Poll the api
    var poll = function(dmid) {
      // Poll it with a get request, including the dmid
      request.get({
        url: 'https://www.codewars.com/api/v1/deferred/' + dmid,
        headers: {
          'Authorization': 'TFp2KBBKWkDu_qCRyByV'
        }
      }, function(error, response, body) {
        // parse the json response
        body = JSON.parse(body); 

        if (body && body.success) {
          // if poll body exists, and the poll is successful, we're good to go.
          console.log('successful poll!');
          console.log(body);
          res.end();
        } else {
          // otherwise, we need to keep polling...
          if (pollCounter++ >= 20) {
            // however, we should safety check here so that we don't overpoll
            // the api and run into endless loop. If we cross 20 polls,
            // something is definitely wrong...
            console.log('-----> Too many polls...');
            res.end();
          } else {
            // as long as we're under the poll limit, keep on polling every
            // 0.5 seconds with the generated dmid from the initial post
            // request.
            console.log('poll # ', pollCounter);
            setTimeout(function() {
              poll(dmid);
            }, 500);
          }
        }
      });
    };

    // kick things off here with the first post request to the api, passing in
    // the project id and solution id. This will return the dmid which we can
    // use for polling.
    request.post({
      url: 'https://www.codewars.com/api/v1/code-challenges/projects/' + req.body.projectId + '/solutions/' + req.body.solutionId + '/attempt',
      json: {
        code: 'dummy code'
      },
      headers: {
        'Authorization': 'TFp2KBBKWkDu_qCRyByV'
      }
    }, function(error, response, body) {
      if (error) {
        console.log('-----> Error when doing initial attempt...');
        res.end();
      }

      // run the initial poll with the fetched dmid.
      poll(body.dmid);
    });
  },

  submitChallenge: function(req, res) {
    // TODO: Needs to be able to submit a challenge and test it
  },

  getAllChallenges: function(req, res) {
    // TODO: Be able to get all challenges here
    res.send('need to somehow get all challenges');
  }
};