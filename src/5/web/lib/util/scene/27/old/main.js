window.addEventListener('DOMContentLoaded', (event) => {
    const tsv = `画面ID	要素ID	type	label	placeholder	value,min,max,step	datalist	attrs
all-type	description	textarea	説明	説明。			
all-type	category	select	カテゴリ		key2	{"key1":"label-1", "groupValue":{"key2":"label-2"}}	
all-type	title	text	タイトル	表題			
all-type	search	search	検索	検索キーワード			
all-type	url	url	URL	https://domain.com/			
all-type	tel	tel	電話番号	00000000000			
all-type	password	password	パスワード	見せられないよ！			
all-type	even	number	偶数	0	,0,100,2		
all-type	odd	range	奇数	0	,1,99,2		
all-type	datetime	datetime	日時				
all-type	date	date	日付				
all-type	month	month	月				
all-type	week	week	週				
all-type	time	time	時刻				
all-type	color	color	色				
all-type	file	file	ファイル				
all-type	sex	radio	性別		female	{"male":"男", "female":"女"}	
all-type	isMan	check	人間か		true		
all-type	editor	div					{"tabindex":0, "contenteditable":true}
all-type	viewer	div					{"tabindex":0}
dl-ex	description	textarea	説明	説明。		["候補１(無効)","候補２(無効)"]	
dl-ex	category	select	カテゴリ		key2	{"key1":"label-1", "groupValue":{"key2":"label-2"}}	
dl-ex	title	text	タイトル	表題		["候補１","候補２"]	
dl-ex	search	search	検索	検索キーワード		["候補１","候補２"]	
dl-ex	url	url	URL	https://domain.com/		["候補１","候補２"]	
dl-ex	tel	tel	電話番号	00000000000		["候補１","候補２"]	
dl-ex	password	password	パスワード	見せられないよ！		["候補１(無効)","候補２(無効)"]	
dl-ex	even	number	偶数	0	0,0,100,2	[0,25,50,75,100]	
dl-ex	odd	range	奇数	0	0,1,99,2	[1,24,49,74,99]	
dl-ex	datetime	datetime	日時			["1999-12-31T23:59:59","2000-01-01T00:00:00"]	
dl-ex	date	date	日付			["1999-12-31","2000-01-01"]	
dl-ex	month	month	月			["1999-12","2000-01"]	
dl-ex	week	week	週			["1999-W52","2000-W01"]	
dl-ex	time	time	時刻			["00:00","23:59"]	
dl-ex	color	color	色			["#ff0000","#00ff00","#0000ff"]	
dl-ex	file	file	ファイル			["候補１(無効)","候補２(無効)"]	
dl-ex	sex	radio	性別		female	{"male":"男", "female":"女"}	
dl-ex	isMan	check	人間か		true		
dl-ex	editor	div	エディタ				{"tabindex":0, "contenteditable":true}
dl-ex	viewer	div	ビューア				{"tabindex":0}
sub	title	text	タイトル	サブ画面		["候補１","候補２"]	
sub	reset	reset			初期化		
sub	submit	submit			送信		
sub	save	button			保存		
third	title	text	タイトル	第三画面		["候補１","候補２"]	
layout	description	textarea	説明	説明。			
layout	category	select	カテゴリ		key2	{"key1":"label-1", "groupValue":{"key2":"label-2"}}	
layout	title	text	タイトル	表題			
layout	search	search	検索	検索キーワード			
layout	url	url	URL	https://domain.com/			
layout	tel	tel	電話番号	00000000000			
layout	password	password	パスワード	見せられないよ！			
layout	even	number	偶数	0	0,0,100,2		
layout	odd	range	奇数	0	0,1,99,2		
layout	datetime	datetime	日時				
layout	date	date	日付				
layout	month	month	月				
layout	week	week	週				
layout	time	time	時刻				
layout	color	color	色				
layout	file	file	ファイル				
layout	sex	radio	性別		female	{"male":"男", "female":"女"}	
layout	isMan	check	人間か		true		
layout	editor	div	エディタ				{"tabindex":0, "contenteditable":true}
layout	viewer	div	ビューア				{"tabindex":0}
layout	save	button			JSONファイルダウンロード		
layout	load	button			JSONファイル読込		
layout	category	select	カテゴリ(option無し)				
layout	multi-children	div	複数children				
display	description1	textarea	説明1	説明1。			
display	description2	textarea	説明2	説明2。			
origin-ui	b0	van-button	ボタン0				
origin-ui	b1	van-button			ボタン1		
origin-ui	b2	van-button	ボタン2				{"onpush":"alert('onPush')","onhold":"alert('onHold')"}
origin-ui	b3	van-button	ボタン3				
origin-ui	b5	van-button	ボタン5				{"onced":true}
origin-ui	b6	van-button	ボタン6				{"once":500}
origin-ui	b7	van-button	ボタン7				{"hold":4000,"onhold":"alert('4秒も押したよ')"}
origin-ui	b8	van-button	ボタン8				{"disabled":true}
origin-ui	b9	van-button	ボタン9				{"radiused":true}
origin-ui	b10	van-button	ボタン10				{"radius":"50%"}
origin-ui	b11	van-button	ボタン11				{"colors":"red,green,blue"}
origin-ui	b12	van-button	ボタン12				
origin-ui	b13	van-button	ボタン13				{"light":true}
origin-ui	b14	van-button	ボタン14				{"dark":true}
origin-ui	b15	van-button	ボタン15				{"noon":true}
origin-ui	b16	van-button	ボタン16				{"night":true}
origin-ui	b17	van-button	ボタン17				{"color-scheme":"night"}
origin-ui	writing-mode	button	書字方向切替				
`
    const scene = new Scene()
    scene.Builder.UiMaker.Parsers.add(new VanButtonParser())
    console.log('TSV例 開始-----------------------------')
    console.log(scene.Tsv.get())
    console.log(scene.Tsv.get('ja'))
    console.log(scene.Tsv.get('ja',true))
    console.log(scene.Tsv.get('en'))
    console.log(scene.Tsv.get('en',true))
    console.log(scene.Tsv.header.get())
    console.log(scene.Tsv.header.get('ja'))
    console.log(scene.Tsv.header.get('ja',true))
    console.log(scene.Tsv.header.get('en'))
    console.log(scene.Tsv.header.get('en',true))
    console.log('TSV例 終了-----------------------------')
    scene.init(tsv)
    console.log(scene)
    scene.Builder.setAttr('dl-ex', 'viewer', 'style', ()=>`width:100px;height:100px;`)
    const htmls = van.state([van.tags.p('テキスト一行目'), van.tags.p('二行目')])
    scene.Builder.setChildren('dl-ex', 'viewer', [htmls.val])
    scene.Builder.setAttr('dl-ex', 'description', 'oninput', (e)=>htmls.val=e.target.value)
    scene.Builder.setChildren('dl-ex', 'viewer', [()=>van.tags.div(htmls.val)])

    scene.Builder.setMake('third', (uiMap, sid)=>KvTable.make(uiMap, sid))
//    scene.Builder.setMake('third', (uiMap, sid)=>{
//        return van.tags.div({id:sid},
//            van.tags.h1(sid),
//            van.tags.p('任意にデザインした画面です。'),
//            scene.MakeHelper.table(uiMap, sid)
//    )})
    scene.Builder.setAttr('layout', 'viewer', 'style', ()=>`width:100px;height:100px;`)
    const layoutViewerHtmls = van.state([van.tags.p('テキスト一行目'), van.tags.p('二行目')])
    scene.Builder.setAttr('layout', 'description', 'oninput', (e)=>layoutViewerHtmls.val=e.target.value)
    scene.Builder.addChild('layout', 'viewer', ()=>van.tags.div(layoutViewerHtmls.val))
    scene.Builder.setAttr('layout', 'save', 'onclick', (e)=>{const j=scene.Store.get();console.log(j);JsonFile.download(j, 'scenes.json')})
    scene.Builder.setAttr('layout', 'load', 'onclick', (e)=>{
        const j=scene.Store.get();
        j.layout.sex = 'female'
        console.log(j);
        scene.Store.set(j);
    })

    console.log('doms:', scene.Builder.Map.get('layout').uiMap)
    console.log('doms:', scene.Builder.Map.get('layout').uiMap.values())
    console.log('doms:', Array.from(scene.Builder.Map.get('layout').uiMap.values()))
    scene.Builder.setMake('layout', (uiMap, sid)=>van.tags.div({id:sid}, ()=>KvTable.make(uiMap, sid)))
    //scene.Builder.setMake('layout', (uiMap, sid)=>van.tags.div({id:sid}, ()=>scene.MakeHelper.table(uiMap, sid)))
    scene.Builder.setChildren('layout', 'multi-children', [van.tags.h1('複数'),van.tags.p('子要素')])

    const displayRows = van.state(`${document.documentElement.clientHeight}px`)
    scene.Builder.setMake('display', (uiMap, sid)=>{
        return van.tags.div(
            {id:sid, style:()=>`display:grid;grid;grid-template-columns:1fr 1fr;grid-template-rows:${displayRows.val};`}, 
            ...Array.from(uiMap).map(([k,v])=>v.dom.el),
    )})

    scene.Builder.setAttr('origin-ui', 'writing-mode', 'onclick', (e)=>Css.set('writing-mode', `${((Css.get('writing-mode').startsWith('vertical')) ? 'horizontal-tb' : 'vertical-rl')}`, scene.Transitioner.nowEl))
    scene.Builder.setAttr('origin-ui', 'b3', 'onpush', (e)=>alert('ボタン３を押した！'))
    scene.Builder.setAttr('origin-ui', 'b3', 'onhold', (e)=>alert('ボタン３を長〜く押した！'))
    scene.Builder.setAttr('origin-ui', 'b12', 'colors', 'yellow,cyan,magenta')

    window.addEventListener('resize', debounce(()=>{KvTable.resize();displayRows.val=document.documentElement.clientHeight;}, 300))
//    window.addEventListener('resize', debounce(()=>{displayRows.val=document.documentElement.clientHeight;}, 300))
    van.add(document.body, 
        van.tags.button({onclick:e=>scene.Transitioner.move()},'画面遷移'),
        van.tags.button({onclick:e=>scene.Transitioner.first()},'最初の画面へ遷移'),
        van.tags.button({onclick:e=>scene.Transitioner.last()},'最後の画面へ遷移'),
    )
    FocusLoop.init() 
    scene.addBody()
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

