<script>
        results.data.category_id = "<?php echo $result['category_id'];?>";
        results.data.category_name = "<?php echo $result['category_name'];?>";
        results.data.route = "<?php echo $result['route'];?>";
        results.data.type = "<?php echo $result['items']['type'];?>";
        results.data.page = <?php echo json_encode($result['page']);?>;
        results.data.items = <?php echo json_encode($result['items']);?>;
        results.init();
    </script>