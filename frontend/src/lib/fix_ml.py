import codecs
import re

path = r'c:\Users\hasna\.gemini\antigravity-ide\scratch\ncert-alive\frontend\src\lib\i18n.js'

with codecs.open(path, 'r', 'utf-8', errors='replace') as f:
    content = f.read()

correct_block = """    join_thousands: 'കൂടുതൽ മികച്ച രീതിയിൽ പഠിക്കുന്ന ആയിരക്കണക്കിന് സിബിഎസ്ഇ വിദ്യാർത്ഥികളോടൊപ്പം ചേരുക',
    lang_hint: 'AI എല്ലാം നിങ്ങളുടെ ഭാഷയിൽ വിശദീകരിക്കും',
    live_demo: 'ലൈവ് ഡെമോ',
    login_footer_note: 'എക്കാലവും സൗജന്യം · 100% NCERT അലൈൻഡ് · ഇന്ത്യയ്ക്കായി നിർമ്മിച്ചത് 🇮🇳',
    nav_cards: 'കാർഡുകൾ',
    nav_demo: 'ഡെമോ',
    nav_doubts: 'സംശയങ്ങൾ',
    nav_features: 'സവിശേഷതകൾ',
    nav_forschools: 'സ്കൂളുകൾക്കായി',
    nav_listen: 'കേൾക്കൂ',
    nav_logout: 'ലോഗ് ഔട്ട്',
    nav_quiz: 'ക്വിസ്',
    nav_rank: 'റാങ്ക്',
    nav_study: 'പഠനം',
    or_try_demo: 'അല്ലെങ്കിൽ ഡെമോ പരീക്ഷിക്കൂ',
    parent_email_opt: 'രക്ഷിതാവിന്റെ ഇമെയിൽ (വേണമെങ്കിൽ മാത്രം)',
    password: 'പാസ്‌വേഡ്',
    paste_text: 'ടെക്സ്റ്റ് ഒട്ടിക്കൂ',
    photo: 'ഫോട്ടോ',
    pill_doubt: '24/7 സംശയ നിവാരണം',
    pill_leaderboard: 'ലൈവ് ലീഡർബോർഡ്',
    pill_quiz: 'ഓട്ടോ ക്വിസ് ജനറേറ്റർ',
    pill_simplify: 'AI ടെക്സ്റ്റ് ലളിതമാക്കൽ',
    please_wait: 'ദയവായി കാത്തിരിക്കൂ...',
    preview_stat_1_title: 'NCERT ക്ലാസ്സുകൾ',
    preview_stat_1_val: '6 മുതൽ 12 വരെ',
    preview_stat_2_title: 'AI പഠന സഹായികൾ',
    preview_stat_2_val: '4-ഇൻ-1 സ്യൂട്ട്',
    preview_stat_3_title: 'ലഭ്യമായ ഭാഷകൾ',
    preview_stat_3_val: '20+ ഇന്ത്യൻ ഭാഷകൾ',
    ready: 'പഠിക്കാൻ തയ്യാറോ?',
    register: 'രജിസ്റ്റർ',
    role_btn_parent: 'രക്ഷിതാവ് ഡെമോ പരീക്ഷിക്കൂ →',
    role_btn_student: 'വിദ്യാർത്ഥി ഡെമോ പരീക്ഷിക്കൂ →',
    role_btn_teacher: 'അധ്യാപകൻ ഡെമോ പരീക്ഷിക്കൂ →',
    role_label_parent: 'രക്ഷിതാക്കൾക്കായി',
    role_label_student: 'വിദ്യാർത്ഥികൾക്കായി',
    role_label_teacher: 'അധ്യാപകർക്കായി',
    role_parent: 'രക്ഷിതാവ്',
    role_parent_f1: 'തത്സമയ പുരോഗതി വിലയിരുത്തൽ',
    role_parent_f2: 'ക്വിസ് സ്കോർ ചരിത്രം',
    role_parent_f3: 'അധ്യായങ്ങൾ പൂർത്തിയാക്കിയ വിവരങ്ങൾ',
    role_parent_f4: 'ബന്ധിപ്പിച്ച കുട്ടികളുടെ അക്കൗണ്ടുകൾ',
    role_student: 'വിദ്യാർത്ഥി',
    role_student_f1: 'AI അധ്യായം ലളിതമാക്കൽ',
    role_student_f2: '24/7 സംശയ നിവാരണം',
    role_student_f3: 'ഓട്ടോ ക്വിസ് & ഫ്ലാഷ് കാർഡുകൾ',
    role_student_f4: 'XP പോയിന്റും സ്ട്രീക്ക് ട്രാക്കിംഗും',
    role_teacher: 'അധ്യാപകൻ',
    role_teacher_f1: 'NCERT ഉള്ളടക്കങ്ങൾ നൽകുക',
    role_teacher_f2: 'വിദ്യാർത്ഥികളുടെ പ്രവർത്തനങ്ങൾ വിലയിരുത്തുക',
    role_teacher_f3: 'ക്ലാസ്സിന്റെ പ്രകടനം വിലയിരുത്തുക',
    role_teacher_f4: 'വിദ്യാർത്ഥികളുടെ പട്ടിക നിയന്ത്രിക്കുക',
    roles_sub: 'വിദ്യാർത്ഥികൾക്കും രക്ഷിതാക്കൾക്കും അധ്യാപകർക്കും പ്രത്യേകം ഡാഷ്ബോർഡുകൾ ലഭിക്കുന്നു.',
    roles_title: 'ഓരോരുത്തർക്കുമായി പ്രത്യേകം രൂപകൽപ്പന ചെയ്തത്',
    sign_in: 'സൈൻ ഇൻ',
    sign_in_continue: 'നിങ്ങളുടെ പഠന യാത്ര തുടരുന്നതിനായി സൈൻ ഇൻ ചെയ്യുക',
    simplify: 'AI കൊണ്ട് വിശദീകരിക്കൂ',
    start_free: 'സൗജന്യമായി ആരംഭിക്കൂ',
    streak: 'സ്ട്രീക്',
    tagline: 'CBSE വിദ്യാർത്ഥികൾക്കുള്ള AI പഠന സഹായി',
    tw_ai_tutor: 'നിങ്ങളുടെ AI ട്യൂട്ടറോടൊപ്പം.',
    tw_multilingual: '20+ ഇന്ത്യൻ ഭാഷകളിൽ.',
    tw_score_higher: 'കൂടുതൽ മാർക്ക് നേടൂ.',
    tw_smarter_way: 'ബുദ്ധിപൂർവ്വം.',
    upload_first: 'ആദ്യം NCERT പേജ് അപ്ലോഡ് ചെയ്യൂ',
    upload_pdf: 'PDF അപ്ലോഡ്',
    webcam: 'വെബ്‌കാം',
    welcome_back: 'വീണ്ടും സ്വാഗതം 👋',"""

# Find where it went wrong
start_pattern = "    join_thousands: '"
end_pattern = "    xp_points: "

idx1 = content.find(start_pattern, content.find("  ml: {"))
idx2 = content.find(end_pattern, idx1)

if idx1 != -1 and idx2 != -1:
    content = content[:idx1] + correct_block + "\n" + content[idx2:]
    with codecs.open(path, 'w', 'utf-8') as f:
        f.write(content)
    print("Fixed!")
else:
    print("Could not find the bounds!")
