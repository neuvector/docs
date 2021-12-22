---
title: CLI Commands
taxonomy:
    category: docs
---

## Command Line Reference

### Login/Logout

```
> login -h
Usage: cli login [OPTIONS]

  Login and obtain an authentication token.

Options:
  --username TEXT
  --password TEXT
  -h, --help       Show this message and exit.
```

```
> logout -h
Usage: cli logout [OPTIONS]

  Clear local authentication credentials.

Options:
  -h, --help  Show this message and exit.
```

```
> exit -h
Usage: cli exit [OPTIONS]

  Exit CLI.

Options:
  -h, --help  Show this message and exit.
```


### User

```
> create user -h
Usage: cli create user [OPTIONS] USERNAME ROLE

  Create user.

Options:
  --email TEXT
  --locale TEXT
  --password TEXT
  --password2 TEXT
  -h, --help        Show this message and exit.
```

```
> set user -h
Usage: cli set user [OPTIONS] USERNAME COMMAND [ARGS]...

  Set user configuration.

Options:
  -h, --help  Show this message and exit.

Commands:
  email     Set user Email address.
  locale    Set user locale.
  password  Set user password.
  role      Set user role.
  timeout   Set user idle timeout in seconds (30 ~ 3600).
```

```
> unset user -h
Usage: cli unset user [OPTIONS] USERNAME COMMAND [ARGS]...

  Unset user configuration.

Options:
  -h, --help  Show this message and exit.

Commands:
  email    Unset user Email address.
  timeout  Unset user idle timeout.
```
  
```
> delete user -h
Usage: cli delete user [OPTIONS] USERNAME

  Delete user.

Options:
  -h, --help  Show this message and exit.
```


### Policy

```
> create group -h
Usage: cli create group [OPTIONS] NAME

  Create group.

  For --lable, use format: key,value. If the option value starts with @, the
  criterion matches string with substring 'value'.

Options:
  --image TEXT        container image name.
  --node TEXT         node name.
  --container TEXT    container workload name.
  --application TEXT  container application name.
  --label TEXT        container label.
  -h, --help          Show this message and exit.
```

```
> set group -h
Usage: cli set group [OPTIONS] NAME

  Set group configuration.

  For --lable, use format: key,value. If the option value starts with @, the
  criterion matches string with substring 'value'.

Options:
  --image TEXT        container image name.
  --node TEXT         node name.
  --container TEXT    container workload name.
  --application TEXT  container application name.
  --label TEXT        container label.
  -h, --help          Show this message and exit.
```


```
> delete group -h
Usage: cli delete group [OPTIONS] NAME

  Delete group.

Options:
  -h, --help  Show this message and exit.
```

```
> create policy rule -h
Usage: cli create policy rule [OPTIONS] FROM TO

  Create and append policy rule, with unique rule id (< 10000).

Options:
  --id INTEGER           Policy rule ID. (Optional)
  --ports TEXT           Port list. eg: any or
                         80,8080,8500-8508,tcp/443,tcp/3306-3307,udp/53
  --applications TEXT    Application list. eg: http,kafka
  --action [allow|deny]
  --after INTEGER        Specify policy rule ID that the new rule is inserted
                         after. Use 0 to insert to the first.
  --comment TEXT
  -h, --help             Show this message and exit.
```

```
> set policy rule -h
Usage: cli set policy rule [OPTIONS] ID

  Configure policy rule.

Options:
  --from TEXT
  --to TEXT
  --ports TEXT           Port list. eg: any or
                         80,8080,8500-8508,tcp/443,tcp/3306-3307,udp/53
  --applications TEXT    Application list. eg: http,kafka
  --action [allow|deny]
  --after INTEGER        Specify policy rule ID that the new rule is inserted
                         after. Use 0 to insert to the first.
  --comment TEXT
  -h, --help             Show this message and exit.
```

```
> delete policy rule -h
Usage: cli delete policy rule [OPTIONS] ID

  Delete policy rule.

Options:
  -h, --help  Show this message and exit.
```

```
> show service -h
Usage: cli show service [OPTIONS] COMMAND [ARGS]...

  Show service

Options:
  --sort TEXT            sort field.
  --sort_dir [asc|desc]  sort direction.
  -h, --help             Show this message and exit.

Commands:
  detail  Show service detail.
```

```
> set service -h
Usage: cli set service [OPTIONS] NAME COMMAND [ARGS]...

  Set service configuration.

Options:
  -h, --help  Show this message and exit.

Commands:
  policy_mode  Set service policy mode [discover, monitor, protect]
```

```
> set system new_service policy_mode -h
SEE System (below)
```

### Quarantine
```
> set container
Usage: cli set container [OPTIONS] ID_OR_NAME COMMAND [ARGS]...

  Set container configuration.

Options:
  -h, --help  Show this message and exit.

Commands:
  quarantine  Set container quarantine state.
```

### System

```
> set system -h
Usage: cli set system [OPTIONS] COMMAND [ARGS]...

  Set system configuration.

Options:
  -h, --help  Show this message and exit.

Commands:
  new_service policy_mode    Set system policy mode.
  syslog  	              Set syslog server IP and port (1.2.3.4:514)
```

```
> set system syslog -h
Usage: cli set system syslog [OPTIONS] COMMAND [ARGS]...

  Set syslog settings

Options:
  -h, --help  Show this message and exit.

Commands:
  category  syslog categories...
  level     Set syslog level
  server    Set syslog server IP and port (1.2.3.4:514)
  status    Enable/disable syslog
```

```
> set system new_service policy_mode -h
Usage: cli set system new_service policy_mode [OPTIONS] MODE

  Set system new service policy mode.

Options:
  -h, --help  Show this message and exit.

MODES:
  discover
  monitor
  protect
```

```
> unset system
Usage: cli unset system [OPTIONS] COMMAND [ARGS]...

  Unset system configuration.

Options:
  -h, --help  Show this message and exit.

Commands:
  syslog_server  Unset syslog server address.
```

### Vulnerability Scan

```
> set scan auto -h
Usage: cli set scan auto [OPTIONS] AUTO

  Set scanner mode.

Options:
  -h, --help  Show this message and exit.

AUTO:
  enable
  disable
```

```
> request scan container -h
Usage: cli request scan container [OPTIONS] ID_OR_NAME

  Request to scan one container

Options:
  -h, --help  Show this message and exit.
```

```
> request scan node -h
Usage: cli request scan node [OPTIONS] ID_OR_NAME

  Request to scan one node

Options:
  -h, --help  Show this message and exit.
```

```
> show scan container -h
Usage: cli show scan container [OPTIONS]

  Show scan container summary

Options:
  --sort TEXT            sort field.
  --sort_dir [asc|desc]  sort direction.
  --node TEXT            list scan result on a given node
  --first INTEGER        list the first n scan result, default is list all
  -h, --help             Show this message and exit.
```

```
> show scan node -h
Usage: cli show scan node [OPTIONS]

  Show scan node summary

Options:
  --sort TEXT            sort field.
  --sort_dir [asc|desc]  sort direction.
  --first INTEGER        list the first n scan result, default is list all
  -h, --help             Show this message and exit.
```

```
> show scan image -h
Usage: cli show scan image [OPTIONS]

  Show scan image summary

Options:
  --sort TEXT            sort field.
  --sort_dir [asc|desc]  sort direction.
  --first INTEGER        list the first n scan result, default is list all
  -h, --help             Show this message and exit.
```

```
> show scan report container -h
Usage: cli show scan report container [OPTIONS] ID_OR_NAME

  Show scan container detail report

Options:
  -h, --help  Show this message and exit.
```

```
> show scan report image -h
Usage: cli show scan report image [OPTIONS] NAME

  Show scan image detail report

Options:
  -h, --help  Show this message and exit.
```

```
> show scan report node -h
Usage: cli show scan report node [OPTIONS] ID_OR_NAME

  Show scan node detail report

Options:
  -h, --help  Show this message and exit.
```


### Show/Debug commands

```
> show container -h
Usage: cli show container [OPTIONS] COMMAND [ARGS]...

  Show container.

Options:
  -b, --brief            brief output
  --sort TEXT            sort field.
  --sort_dir [asc|desc]  sort direction.
  -h, --help             Show this message and exit.

Commands:
  detail   Show container detail.
  setting  show container configurations.
  stats    Show container statistics.
```

```
> show enforcer -h
Usage: cli show enforcer [OPTIONS] COMMAND [ARGS]...

  Show enforcer.

Options:
  --sort TEXT            sort field.
  --sort_dir [asc|desc]  sort direction.
  -h, --help             Show this message and exit.

Commands:
  counter  Show enforcer counters.
  detail   Show enforcer detail.
  setting  show enforcer configurations.
  stats    Show enforcer statistics.
```

```
> show conversation -h
Usage: cli show conversation [OPTIONS] COMMAND [ARGS]...

  Show conversations.

Options:
  -g, --group TEXT       filter conversations by group
  --sort TEXT            sort field.
  --sort_dir [asc|desc]  sort direction.
  -h, --help             Show this message and exit.

Commands:
  pair  Show conversation detail between a pair of...
```

```
> show controller -h
Usage: cli show controller [OPTIONS] COMMAND [ARGS]...

  Show controller.

Options:
  --sort TEXT            sort field.
  --sort_dir [asc|desc]  sort direction.
  -h, --help             Show this message and exit.

Commands:
  detail   Show controller detail.
  setting  show controller configurations.
```

```
> show group -h
Usage: cli show group [OPTIONS] COMMAND [ARGS]...

  Show group.

Options:
  --sort TEXT            sort field.
  --sort_dir [asc|desc]  sort direction.
  -h, --help             Show this message and exit.

Commands:
  detail  Show group detail.
```

```
> show log -h
Usage: cli show log [OPTIONS] COMMAND [ARGS]...

  Log operations.

Options:
  -h, --help  Show this message and exit.

Commands:
  event      List events.
  threat     List threats.
  violation  List policy violations.
```

```
> show node -h
Usage: cli show node [OPTIONS] COMMAND [ARGS]...

  Show node.

Options:
  --sort TEXT            sort field.
  --sort_dir [asc|desc]  sort direction.
  -h, --help             Show this message and exit.

Commands:
  bench           Show node bench.
  detail          Show node detail.
  ip_2_container  Show node ip-container map.
```

```
> show policy -h
Usage: cli show policy [OPTIONS] COMMAND [ARGS]...

  Show policy.

Options:
  -h, --help  Show this message and exit.

Commands:
  derived  List derived policy rules
  rule     Show policy rule.
```

```
> show session -h
Usage: cli show session [OPTIONS] COMMAND [ARGS]...

  Show sessions.

Options:
  -h, --help  Show this message and exit.

Commands:
  list     list session.
  summary  show session summary.
```

```
> show system -h
Usage: cli show system [OPTIONS] COMMAND [ARGS]...

  System operations.

Options:
  -h, --help  Show this message and exit.

Commands:
  setting  Show system configuration.
  summary  Show system summary.
```

```
> show user -h
Usage: cli show user [OPTIONS] COMMAND [ARGS]...

  Show user.

Options:
  -h, --help  Show this message and exit.
```

```
> set enforcer -h
Usage: cli set enforcer [OPTIONS] ID_OR_NAME COMMAND [ARGS]...

  Set enforcer configuration.

Options:
  -h, --help  Show this message and exit.

Commands:
  debug  Configure enforcer debug.
```

```
> delete conversation pair -h
Usage: cli delete conversation pair [OPTIONS] CLIENT SERVER

  Delete conversations between a pair of containers.

Options:
  -h, --help  Show this message and exit.
```

```
> delete session -h
Usage: cli delete session [OPTIONS]

  clear session.

Options:
  -e, --enforcer TEXT  filter sessions by enforcer
  --id TEXT            filter sessions by session id
  -h, --help           Show this message and exit.
```

### Export/Import

```
> request export config -h
Usage: cli request export config [OPTIONS]

  Export system configurations.

Options:
  -s, --section [user|policy]
  -f, --filename PATH
  -h, --help                   Show this message and exit.
```

```
> request import config -h
Usage: cli request import config [OPTIONS] FILENAME

  Import system configurations.

Options:
  -h, --help  Show this message and exit.
```

### License

```
> show system license -h
Usage: cli show system license [OPTIONS]

  Show system license.

Options:
  -h, --help  Show this message and exit.
```

License generation is to create the license request code to be sent to the NeuVector sales team. All input parameters are to provide general information about the user's deployment environment. A sales person will contact you to confirm parameters before generating the license file.
```
> request license generate -h
Usage: cli request license generate [OPTIONS]

  Request license generation code

Options:
  --name TEXT                 user name
  --email TEXT                email
  --phone TEXT                phone
  --months INTEGER            duration in months
  --node_limit INTEGER        number of hosts supported
  --cpu_limit INTEGER         number of cpus supported
  --scan [enable|disable]     Allow container scan
  --enforce [enable|disable]  Allow enforce mode
  -h, --help                  Show this message and exit.
```

After you have obtained the license from NeuVector, use the following CLI to load the license. Just copy the license content as the last argument.
```
> request license load -h
Usage: cli request license load [OPTIONS] LICENSE

  Load new license

Options:
  -h, --help  Show this message and exit.
```

```
> request license delete -h
Usage: cli request license delete [OPTIONS]

  Delete current license

Options:
  -h, --help  Show this message and exit.
```

#### Packet Sniffer

Note: Sniffer files are stored in the /var/neuvector/pcap directory. Make sure you map the volume to your guest machine directory or local system directory to access the files. For example in the docker-compose file add ‘- /var/neuvector:/var/neuvector’ in volumes.


```
request sniffer start -h
Usage: cli request sniffer start [OPTIONS]

  Start sniffer.

Options:
  -e, --enforcer TEXT        Add sniffer by enforcer
  -c, --container TEXT       Add sniffer by container
  -f, --file_number INTEGER  Maximum number of rotation files
  -s, --file_size INTEGER    Maximum size (in MB) of rotation files
  -o, --options TEXT         Sniffer filter
  -h, --help                 Show this message and exit.
```

```
show sniffer -h
Usage: cli show sniffer [OPTIONS] COMMAND [ARGS]...

  Show sniffer.

Options:
  -e, --enforcer TEXT  Show sniffers by enforcer
  -h, --help           Show this message and exit.
```

```
request sniffer stop -h
Usage: cli request sniffer stop [OPTIONS] ID

  Stop sniffer. You may need to include both the enforcer ID and the container ID.

Options:
  -e, --enforcer TEXT  Delete sniffer by enforcer
  -h, --help           Show this message and exit.
```