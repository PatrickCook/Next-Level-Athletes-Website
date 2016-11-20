<small>Please log in below to change scheduling or view excercises.</small><br><br>
<form name="login-form" class="style-4" id="login-form" method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
  <fieldset>
  <dl>
    <dt>
      <label title="Username">Username:
      <input tabindex="1" accesskey="u" name="username" type="text" maxlength="50" id="username" />
      </label>
    </dt>
  </dl>
  <dl>
    <dt>
      <label title="Password">Password:
      <input tabindex="2" accesskey="p" name="password" type="password" maxlength="15" id="password" />
      </label>
    </dt>
  </dl>
  <dl>
    <dt>
      <label title="Submit">
      <input class="btn login-but" tabindex="3" accesskey="l" type="submit" name="cmdlogin" value="Login" />
      </label>
    </dt>
  </dl>
  </fieldset>
</form>
