package com.mni.api.auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter  {

    public static final String ADMIN_ROLE = "ADMIN";
    public static final String USER_ROLE = "USER";

    @Override
    protected void configure(final AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
                .withUser("user1").password(passwordEncoder().encode("user1Pass")).roles(USER_ROLE)
                .and()
                .withUser("admin").password(passwordEncoder().encode("adminPass")).roles(ADMIN_ROLE);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                    .antMatchers("/api/user").permitAll()
                    .antMatchers("/swagger-ui.html*/**").hasRole(ADMIN_ROLE)
                    .antMatchers("/v2/api-docs").hasRole(ADMIN_ROLE)
                    .antMatchers(HttpMethod.POST, "/api/**").hasRole(ADMIN_ROLE)
                    .antMatchers(HttpMethod.PUT, "/api/**").hasRole(ADMIN_ROLE)
                    .antMatchers(HttpMethod.DELETE, "/api/**").hasRole(ADMIN_ROLE)
                    .antMatchers(HttpMethod.GET, "/api/**").hasAnyRole(USER_ROLE, ADMIN_ROLE)
                    .antMatchers("/images/*").permitAll()
                    .antMatchers("/**").hasAnyRole(USER_ROLE, ADMIN_ROLE)
                    .anyRequest().authenticated()

                    .and()
                .formLogin()
                    .loginPage("/login.html")
                    .defaultSuccessUrl("/", true)
                    .permitAll()
                    .and()
                .logout()
                    .logoutUrl("/logout")
                    .logoutSuccessUrl("/login.html")
                    .permitAll();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
