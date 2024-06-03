<script>
  export let variant;
  const variantColorMap = {
    gold: "gold",
    silver: "silver",
    bronze: "#CD7F32",
  };
  $: cssVariables = `--variant: ${variantColorMap[variant]};`;
</script>

<span class="award-badge" style={cssVariables}>⬤</span>

<style lang="scss">
  .award-badge {
    vertical-align: super;
    font-size: 13px;
    color: var(--variant);
  }
</style>
