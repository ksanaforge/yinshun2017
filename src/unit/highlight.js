var renderHits=function(text,hits,func){
	if (!text) return [];
  var i, ex=0,out=[],now;
  hits=hits||[];

  // hist 的內容要排序, 才會產生合理的節錄文字
  if(hits.length>0)
  {
    hits.sort(SortHitsFunc);
    function SortHitsFunc(a, b) 
    {
      if (a[0] === b[0]) {
          return 0;
      }
      else {
          return (a[0] < b[0]) ? -1 : 1;
      }
    }
  }

  for (i=0;i<hits.length;i+=1) {
    now=hits[i][0];
    if (now>ex) {
      const t=text.substring(ex,now);
      out.push(func({key:i},t));
      ex = now;
    }
    // 有時搜尋字串重覆, 所以輸出的字串要處理, 
    // 例如搜尋 "非執取 + 執取" , 執取會重覆出現
    // const stext=text.substr(now,hits[i][1]);

    if(now == ex)
    {
      const stext=text.substr(now,hits[i][1]);  
      out.push(func({key:"h"+i, className:"hl"+hits[i][2]||""},stext));
      ex = now+hits[i][1];
    }
    else if((now < ex) && (now + hits[i][1] > ex))
    {
      // now 小於 ex , 但要取的長度超過 ex
      // 例如原文是 "非執取中...." ,
      // 前一筆是 "非執取" , 下一筆是 "執" 或 "執取" 已經塗過色, 就不處理
      // 若下一筆是 "執取中" , 則還有一個 "中" 字要處理塗色

      const stext=text.substr(ex,now+hits[i][1]-ex);
      out.push(func({key:"h"+i, className:"hl"+hits[i][2]||""},stext));
      ex = now+hits[i][1];
    }
  }
  out.push(func({key:i+1},text.substr(ex)));
  return out;
};
const  buildlinelengths=function(rawtext){
  var linelengths=[];
  var acc=0;
  for (let i=0;i<rawtext.length;i++) {
    linelengths.push(acc);
    acc+=rawtext[i].length;
  }
  linelengths.push(acc);
  return linelengths;
}
const highlightExcerpt=function(cor,excerpt,phrasepostings){
  if (!phrasepostings) return [];
  const linebreaks=excerpt.linebreaks;
  const getrawline=function(line){
    return (line<excerpt.rawtext.length)?excerpt.rawtext[line]:"" ;
  };
  const linelengths=buildlinelengths(excerpt.text.split("\n"));
  var hl=[];

  for(let j=0;j<excerpt.phrasehits.length;j++) {
    const hits=excerpt.phrasehits[j].hits;
    const hitsend=excerpt.phrasehits[j].hitsend;
    if (!phrasepostings[j])continue;
    const phraselengths=phrasepostings[j].lengths;
    const linecharr=hits.map((hit,idx)=>{
      const range=cor.makeRange(hit,hitsend[idx]);
      var {start,end}=cor.toLogicalRange(excerpt.linebreaks,range,getrawline);
      const absstart=linelengths[start.line]+start.ch +start.line //for linefeed ;
      const absend=linelengths[end.line]+end.ch + end.line ;

      hl.push([absstart,absend-absstart,j]);
    });
  }

  return hl;
} 

module.exports={renderHits,highlightExcerpt}