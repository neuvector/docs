---
title: 5.x Notifications
taxonomy:
category: docs
slug: /ui_extension/notifications
---


### Event Reporting

#### Security Events

In UI Extension on Rancher portal, Security Events works similar as NeuVector standalone page.
The events can be triggered by several factors

- Dangerous conversation or data transportation from somewhere to the endpoint (Node or pod)
- End-to-end violated connection against network policy
- Violated operation against process profile rule
- Violated operation against file access rule

![Security Events](sec_events.png)

Slide left or  / and right dot on the time slider to filter events by date.

![Security Events](sec_events_time_filter.png)

Type in keyword into quick filter box to filter any event which includes the keyword.

![Security Events](sec_events_quick_filter.png)

Open the Advanced filter slide panel, there are multiple options supporting your searching.

- Severity, Location and Category can be filtered according to the tags on the right side of the event title.
- Autocomplete list can support user to enter Host, Source, Destination
- Autocomplete list also support multiple tag-input box for Namespace

![Security Events](sec_events_adv_filter.png)

To read the details of the event, click on a record to expand the panel. In the message box, it contains more informations.

![Security Events](sec_event_detail.png)

Host name is clickable for opening host detail popup. Vulnerabilities and Group have external link to redirect to NeuVector SSO page.

![Security Events](node_detail_open.png)

Workload name is clickable for opening workload detail popup. Group has external link to redirect to NeuVector SSO page.

![Security Events](pod_detail_open.png)

Reported by field in the message box is clickable for opening enforcer detail popup.

![Security Events](enforcer_detail_open.png)

### Not included functions comparing with NeuVector standalone page

Review / Propose rule

PDF report