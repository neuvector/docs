---
title: Command Line
taxonomy:
    category: docs
---

### Managing NeuVector from the Command Line
The NeuVector solution can be managed using the CLI. The CLI uses a RestAPI for the Controller to issue commands to the Controller. The Controller then manages the Enforcer(s) appropriately. You can access the NeuVector CLI by typing the cli command for the Manager or Allinone, for example:
```
kubectl exec -it neuvector-manager-pod-5bb76b6754-rlmnp -n neuvector -- cli 
```

```
$ docker exec -it allinone cli
```
Where ‘allinone’ is the container name for the Controller. You may need to use the container ID for the name.

##### CLI Commands
Here are some of the most common CLI commands:

```
> login
> logout
```
Use the same user/password you use for the console.

```
> show policy -h
Usage: cli show policy [OPTIONS] COMMAND [ARGS]...
```

```
> create policy rule -h
Usage: cli create policy rule [OPTIONS] FROM TO
> delete policy rule -h
Usage: cli delete policy rule [OPTIONS] ID
```

```
> show log -h
Usage: cli show log [OPTIONS] COMMAND [ARGS]...
```

```
> set system policy_mode -h
Usage: cli set system policy_mode [OPTIONS] MODE

  Set system policy mode.

Options:
  -h, --help  Show this message and exit.

MODES:
  learn=discover
  evaluate=monitor
  enforce=protect
```

```
> set controller <leader_controller_id> debug -c cpath
  Turn on debug mode.
```
```
> set controller <leader_controller_id> debug
  Turn off debug mdoe.
```

All CLI commands are listed in the next section.

Please contact support@neuvector.com if you are interested in integrating directly with the RestAPI.