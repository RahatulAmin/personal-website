import { ImageResponse } from 'next/og';
export const dynamic='force-static';
export const alt='Rahatul Ananto — Different people. Different experiences. Better robots.';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function OG(){return new ImageResponse(<div style={{display:'flex',flexDirection:'column',justifyContent:'space-between',width:'100%',height:'100%',background:'#f6f5f1',color:'#242825',padding:70}}><div style={{fontSize:22}}>RAHATUL ANANTO · HUMAN–ROBOT INTERACTION</div><div style={{fontSize:76,lineHeight:1.1,display:'flex',flexDirection:'column'}}><span>Different people.</span><span>Different experiences.</span><span style={{color:'#596a58'}}>Better robots.</span></div><div style={{fontSize:22}}>PhD Researcher · McGill University · Montréal</div></div>,size);}
