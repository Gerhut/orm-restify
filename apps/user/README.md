# 用户管理

## 结构

- id： 用户id
- password： 密码
- salt：密码加密盐
- access： 权限

## 中间件

### Authorization

作为其他路由中间件的前置中间件使用。根据请求的 Basic Auth 头判断用户身份，
凡是不符合`minAccess`与`maxAccess`（闭区间）之间权限的用户将返回401。
凡是符合要求的用户，将用户id与权限作为登录用户存入`req.user`。

参数：

- minAccess：可登录的最低权限
- maxAccess：可登录的最高权限

### Register

注册权限为`access`的用户。

默认参数：

- access：注册用户的权限

请求体：

    {
      "id",
      "password"
    }

回应：

- 201：注册成功
- 400：缺少用户名或密码
- 409：用户名已存在

回应体：

    {
      "id",
      "access"
    }

### Change Password

修改登录用户的密码，要求必须存在登录用户。

请求属性：

- `id`：用户id，必须是登录用户的id

请求体：

    {
      "password"
    }

回应：

- 204：更改成功
- 403：非登录用户

### Get Access

获得指定用户（如果参数`self`被设为`true`则只能指定登录用户）的权限。
可用于用户登录请求。如果`self`被设为`true`则要求必须存在登录用户。

参数：

- `self`：设为`true`则只能获得登录用户，此时必须存在登录用户

请求属性：

- id：要获得的用户id，如果参数`self`被设为`true`则必须是登录用户的id

回应：

- 200：获得成功
- 403：非登录用户
- 404：找不到用户

回应体：

    {
      access
    }

### Del

删除指定用户（如果参数`self`被设为`true`则只能指定登录用户）。
如果参数`self`被设为`true`则要求必须存在登录用户。

参数：

- `self`：设为`true`则只能删除登录用户，此时必须存在登录用户

请求属性：

- `id`：要删除的用户id，如果参数`self`被设为`true`则必须是登录用户的id

回应：

- 204：删除成功
- 403：非登录用户
- 404：找不到用户
