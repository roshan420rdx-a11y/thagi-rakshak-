# ठगी रक्षक को internet पर चढ़ाना (Render)

यह गाइड मालिक के लिए है, फ़ोन से बटन-दर-बटन। हर कदम के बाद chat में बता दें कि क्या दिखा, ताकि Claude आगे की जाँच कर सके।

> **पहले से ज़रूरी:** GitHub पर `thagi-rakshak-` repo (नाम के आख़िर में dash) बना हो, और उसमें Claude का code push हो चुका हो (TR-0, हो गया)।

## भाग 1: Render पर साइट बनाना (करीब 10 मिनट)
1. Chrome में **dashboard.render.com** खोलें, और GitHub से login करें। marketplace वाला खाता ही चलेगा।
2. ऊपर **New +** दबाएँ, फिर **Blueprint**।
3. repository की सूची में **thagi-rakshak-** चुनें (न दिखे तो **Configure account** दबाकर Render को इस repo की अनुमति दें)।
4. Render `render.yaml` पढ़कर एक सेवा **thagi-rakshak** दिखाएगा, और ये settings पूछेगा। अभी जितनी पता हैं, उतनी भरें; बाकी बाद में भी भर सकते हैं:

| setting | क्या भरें | अभी न पता हो तो |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | साइट का पता, जैसे `https://thagi-rakshak.onrender.com` | सेवा बनने के बाद Render जो पता दिखाए, वही |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp Business नंबर, `91` से शुरू, सिर्फ़ अंक | ख़ाली छोड़ें (WhatsApp वाला बटन नहीं दिखेगा) |
| `NEXT_PUBLIC_ORG_NAME` | सेवा चलाने वाली संस्था का नाम | ख़ाली छोड़ें |
| `NEXT_PUBLIC_GRIEVANCE_NAME` | शिकायत अधिकारी का नाम | ख़ाली छोड़ें |
| `NEXT_PUBLIC_GRIEVANCE_EMAIL` | शिकायत अधिकारी का email | ख़ाली छोड़ें |

5. **Apply** दबाएँ। पहला build करीब 3-5 मिनट लेता है।
6. ऊपर साइट का पता दिखेगा (`…onrender.com`)। उसे खोलें, और अंत में `/api/health` जोड़कर भी खोलें। वहाँ `"status":"ok"` दिखना चाहिए।
7. अगर `NEXT_PUBLIC_SITE_URL` ख़ाली छोड़ा था: अब सेवा की **Environment** में जाकर यही पता भरें, फिर **Manual Deploy → Deploy latest commit** दबाएँ। (`NEXT_PUBLIC_` वाली settings build के समय जमती हैं, इसलिए बदलने पर हर बार Manual Deploy ज़रूरी है।)

## भाग 2: uptime जाँच चालू करना (2 मिनट)
1. GitHub पर `thagi-rakshak-` repo → **Settings → Secrets and variables → Actions → Variables** tab।
2. **New repository variable**: नाम `SITE_URL`, मान साइट का पता (आख़िर में `/` के बिना)।
3. अब हर 30 मिनट पर GitHub देखेगा कि साइट चल रही है। बंद मिली तो आपको email आएगा।

## भाग 3: Free plan के बारे में ज़रूरी बात
- Render का Free plan कुछ देर किसी के न आने पर साइट को सुला देता है, और अगला आने वाला करीब एक मिनट इंतज़ार करता है। marketplace में यही दिक़्क़त आई थी।
- ठगी के बाद हर मिनट कीमती है, इसलिए **launch से पहले paid (Starter) plan पर सोचें।** कीमत Render पर देखें।
- जिसने साइट एक बार खोल ली, उसके फ़ोन में इमरजेंसी पन्ने सेव हो जाते हैं, और वे सोई साइट पर भी तुरंत खुलते हैं। पहली बार आने वालों को इंतज़ार करना पड़ेगा।

## भाग 4: launch से पहले की जाँच
Claude हर deploy से पहले `npm run launch-check` चलाकर बताएगा कि क्या बाकी है। आज की सूची:
- साइट का https पता, संस्था का नाम, शिकायत अधिकारी, WhatsApp नंबर (settings)
- legal पन्नों की वकील से जाँच
- कम से कम 5 बैंकों की दूसरी जाँच (`docs/verify/BANKS.md`)
- RBI नियमों की मालिक की दूसरी जाँच (`docs/sources/rbi/README.md`)
- ज्ञानकोश की विशेषज्ञ से जाँच

सब ✅ होने पर ही "launch" कहा जाएगा। उससे पहले साइट live रह सकती है, पर उसे "मसौदा" ही माना जाएगा।

## भाग 5: अपना domain (बाद में)
domain लेने पर Render की सेवा में **Settings → Custom Domains** में जोड़ना होगा, और `NEXT_PUBLIC_SITE_URL` बदलकर Manual Deploy करना होगा। उस समय Claude बटन-दर-बटन बताएगा।
