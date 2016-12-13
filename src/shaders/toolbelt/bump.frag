uniform sampler2D texture;
// uniform sampler2D texture2;

uniform vec2 mouse;


uniform float time;


uniform float lightWidth;


uniform float lightBrightness;


varying vec2 vUv;


uniform vec2 resolution;
varying float noise;


void main() {
    vec2 texelWidth = 1.0/resolution;
    vec4 input0 = texture2D(texture,vUv);
    // vec4 input2 = texture2D(texture2,vUv);



    float step = 5.0;
    float tl = abs(texture2D(texture, vUv + texelWidth * vec2(-step, -step)).x);   // top left


    float  l = abs(texture2D(texture, vUv + texelWidth * vec2(-step,  0.0)).x);   // left


    float bl = abs(texture2D(texture, vUv + texelWidth * vec2(-step,  step)).x);   // bottom left


    float  t = abs(texture2D(texture, vUv + texelWidth * vec2( 0.0, -step)).x);   // top


    float  b = abs(texture2D(texture, vUv + texelWidth * vec2( 0.0,  step)).x);   // bottom


    float tr = abs(texture2D(texture, vUv + texelWidth * vec2( step, -step)).x);   // top right


    float  r = abs(texture2D(texture, vUv + texelWidth * vec2( step,  0.0)).x);   // right


    float br = abs(texture2D(texture, vUv + texelWidth * vec2( step,  step)).x);   // bottom right


    float mult = 0.01;


    float dX = tr*mult + 2.0*r*mult + br*mult -tl*mult - 2.0*l*mult - bl*mult;


    float dY = bl*mult + 2.0*b*mult + br*mult -tl*mult - 2.0*t*mult - tr*mult;





    vec4 diffuseColor = texture2D(texture, vUv);


    vec3 color = normalize(vec3(dX,dY,1.0/50.0));





    for( int i = 0; i<4; i++){


      color +=color;


    }


    vec3 lightDir = vec3( vec2( mouse.x/resolution.x, 1.0-mouse.y/resolution.y)-(gl_FragCoord.xy / vec2(resolution.x,resolution.y)), lightWidth );


    lightDir.x *= resolution.x/resolution.y;


    float D = length(lightDir);


    vec3 N = normalize(color);


    vec3 L = normalize(lightDir);


    vec3 H = normalize(L);


    vec4 lightColor = input0;


    vec4 ambientColor = vec4(vec3(input0.rgb*lightBrightness),0.5);

    vec3 falloff = vec3(1.0,3.0,20.5);


    vec3 diffuse = (lightColor.rgb * lightColor.a) * max(dot(N, L), 0.0);
    vec3 ambient = ambientColor.rgb * ambientColor.a;

    float shin = 1000.1;
    float sf = max(0.0,dot(N,H));
    sf = pow(sf, shin);


    float attenuation = 1.0 / (falloff.x + (falloff.y*D) + (falloff.z * D * D) );

    vec3 intensity =  ambient+(diffuse+sf ) * attenuation;

    vec3 finalColor = (diffuseColor.rgb * intensity);

    vec3 col = ambient+( finalColor+sf );

    // col += input2.grb;

    // color *=0.5;
    // color +=0.5;

    // vec4 C = index == 0 ? vec4(col, 1.0) : vec4(color, 1.0);
    vec4 C = vec4(col*1.0, 1.0);
    gl_FragColor = C;
}
