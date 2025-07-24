const { readFile } = require('./read_project');
const { config } = require('./libs');

const {
  SERVICE_KEY,
  SERVICE_NOTIFY_KEY,
} = process.env;

const notificationIds = SERVICE_NOTIFY_KEY.split(' ');
const { add_new_monitor, delete_monitor, delete_all, list } = config(SERVICE_KEY, notificationIds);

list();
//delete_all();
readFile('./sample.csv', (name, url, isPing) => {
    if (isPing) {
        add_new_monitor(name, url, 'ping');
    }
    add_new_monitor(name, url);
});

