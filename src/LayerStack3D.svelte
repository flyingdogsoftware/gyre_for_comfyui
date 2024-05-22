

<script>
export let layers=[]
export let state="3d"
export let mode=""
</script>
<div class="layer-container stacked-top">

  {#if !mode==="drop"}
    {#if layers.length===0}
    <div class="layer bottom-layer " class:bottom-layer-flat={state==="flat"} style="background: url(/appdata/checker_thumb.png)"></div>
    {/if}
    {#if layers.length===1}
    <div class="layer bottom-layer "  class:bottom-layer-flat={state==="flat"} style="background-image: url({layers[0]});"></div>
    {/if}  
    {#if layers.length===2}
    <div class="layer mid-layer "  class:mid-layer-flat={state==="flat"} style="background-image: url({layers[1]})"></div>
    <div class="layer bottom-layer " class:bottom-layer-flat={state==="flat"} style="background-image: url({layers[0]})"></div>
    {/if}  
  {:else}
    <div class="layer drop-layer drop-ripple"  >
      <div></div>
      <div></div>
    </div>
  {/if}

</div>
<style>
            * {
            box-sizing: border-box;
        }

.layer-container {
    width: 100px;
    height: 100px;
    top: 50%;
    left: 50%;
    perspective: 1350px;
   transform-style: preserve-3d;

}

.layer {
  background-size: cover;
  background-position: center;
    width: 100px;
    height: 100px;
    position: absolute;
    transition: all 0.6s ease-in-out;
    cursor: pointer;
    z-index: 1;
    border-radius: 10px;
  box-shadow:
    1px 1px 0 1px #f9f9fb,
    -1px 0 28px 0 rgba(34, 33, 81, 0.01),
    28px 28px 28px 0 rgba(34, 33, 81, 0.85);  
}
.drop-layer {
  background: radial-gradient(#0099dd, #026e81);
    transform: rotateX(45deg) rotateZ(45deg) translateZ(50px);
}


.bottom-layer {
    transform: rotateX(45deg) rotateZ(45deg) translateZ(50px);
}
.bottom-layer:hover, .bottom-layer-flat {
      transform: translate3d(0px, 50px, 50px);

}
.mid-layer {
    transform: rotateX(45deg) rotateZ(45deg) translateZ(100px);
}
.mid-layer:hover, .mid-layer-flat  {
      transform: translate3d(0px, -100px, 50px);

}
.top-layer {
    transform: rotateX(45deg) rotateZ(45deg) translateZ(150px);
}

.drop-ripple {
  display: inline-block;
  position: relative;

}
.drop-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: drop-ripples 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.drop-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes drop-ripples {
  0% {
    top: 46px;
    left: 46px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 92px;
    height: 92px;
    opacity: 0;
  }
}
</style>