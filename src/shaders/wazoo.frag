uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

vec4 r(vec2 _uv, float _t)
{

    vec4 f = vec4( mod(sin(_t+(_uv.x/_uv.y)*length(_uv))+atan(_uv.x,_uv.y),fract(_t-length(_uv)))*(10.+sin(_t-length(_uv))*17.)/length(_uv-tan(_t*2.+_uv.x*10./_uv.y))*4.,
                  (abs(sin(_t*.5)*.1)) /sqrt(length(_uv)),
                   sqrt(length(_uv))*.75,
                   1.);

    f *= vec4(length(f)*.1-length(_uv));

    return f;
}

void main()
{
    float t = time; // + 11.44
	   vec2 uv = (gl_FragCoord.xy-resolution.xy*.5) / resolution.y+sin(t)*.4;

    uv.x += sin(t*2.5)*.2;
    uv.y += cos(t*2.5)*.2;

    vec4 col = vec4(.6, .2, .1, 1.);

    if (length(uv+sin(t*10.-length(uv*7.)) ) < 1.95)
        col += vec4(1.5) * min(mod(t+sin(atan(uv.x,uv.y)+2.),.5),.4);

    if (length(uv) < .9-sin(t+atan(uv.x,uv.y)*200. ) )
		    col *= r(uv,t) + r(uv,t+.01) + r(uv,t-.4)*.5;
    col.w = 1.0;
    gl_FragColor = col;
}
