const axios = require("axios");

const {
  API_KEY,
  BASE_URL,
} = process.env;

const token = API_KEY;

function config(workspace, notificationIds) {
  async function add_new_monitor(name, site, monitor_type = "http") {
    const headers = {
      "User-Agent": "TianjiMonitor/1.0",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      Authorization: "Basic <base64-encoded-credentials>",
      Host: "stats.pop.coop",
      Referer: BASE_URL,
      "Cache-Control": "no-cache",
    };
    let payload = {
      url: site,
      method: "get",
      contentType: "application/json",
      headers: JSON.stringify({
        "User-Agent": "TianjiMonitor/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Authorization: "Basic <base64-encoded-credentials>",
        Host: "stats.pop.coop",
        Referer: BASE_URL,
        "Cache-Control": "no-cache",
      }),
    };
    if (monitor_type !== "http") {
      payload = {
        hostname: site,
      };
    }
    let data = JSON.stringify({
      name,
      type: monitor_type,
      active: true,
      interval: 60,
      maxRetries: 2,
      trendingMode: false,
      notificationIds: notificationIds,
      payload,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/open/workspace/${workspace}/monitor/upsert`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function delete_all() {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/open/workspace/${workspace}/monitor/all`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data) {
          Promise.all(
            response.data.map(async (item) => {
              console.log(`Delete ${item.name}`);
              await delete_monitor(item.id);
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function delete_monitor(monitorId) {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/open/workspace/${workspace}/monitor/${monitorId}/del`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function list() {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/open/workspace/${workspace}/monitor/all`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        response.data.map((item) => {
          console.log(item.notifications);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return {
    add_new_monitor,
    delete_monitor,
    delete_all,
    list,
  };
}

module.exports.config = config;
