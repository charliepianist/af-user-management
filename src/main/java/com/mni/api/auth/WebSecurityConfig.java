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

    @Override
    protected void configure(final AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
                .withUser("user1").password(passwordEncoder().encode("user1Pass")).roles("USER")
                .and()
                .withUser("admin").password(passwordEncoder().encode("adminPass")).roles("ADMIN");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                    .antMatchers("/api/user").permitAll()
                    .antMatchers(HttpMethod.POST, "/api/**").hasRole("ADMIN")
                    .antMatchers(HttpMethod.PUT, "/api/**").hasRole("ADMIN")
                    .antMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")
                    .antMatchers(HttpMethod.GET, "/api/**").hasAnyRole("USER", "ADMIN")
                    .antMatchers("/images/*").permitAll()
                    .antMatchers("/**").hasAnyRole("USER", "ADMIN")
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
