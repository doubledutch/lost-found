# Lost & Found

## Data Model

### Firebase Database

This extension connects to a simple firebase database via
[@doubledutch/firebase-connector](https://www.npmjs.com/package/@doubledutch/firebase-connector)
on a per-event basis.

#### `public/users`

```json
{
  "items": {
    "type": "found",
    "description": "",
    "lastLocation": "",
    "currentLocation": "",
    "dateCreate": "new Date().getTime()",
    "creator": "client.currentUser",
    "isResolved": false
  },
  "reports": {
    ":item.id": {
      "reportTime": "new Date().getTime()",
      "isBlock": false,
      "isApproved": false
    }
  }
}
```
